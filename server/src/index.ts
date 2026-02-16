import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(express.json());

interface Session {
  id: string;
  users: string[];
  code: string;
  language: string;
  problem: string | null;
  createdAt: Date;
}

const sessions = new Map<string, Session>();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodePair server is running' });
});

app.post('/api/sessions/create', (req, res) => {
  const sessionId = uuidv4();
  const session: Session = {
    id: sessionId,
    users: [],
    code: '// Start coding here...\n',
    language: 'javascript',
    problem: null,
    createdAt: new Date(),
  };
  sessions.set(sessionId, session);
  res.json({ sessionId, session });
});

app.get('/api/sessions/:id', (req, res) => {
  const session = sessions.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.json({ session });
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-session', ({ sessionId, username }) => {
    const session = sessions.get(sessionId);
    if (!session) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    socket.join(sessionId);
    session.users.push(username);

    socket.emit('session-joined', {
      sessionId,
      code: session.code,
      language: session.language,
      users: session.users,
    });

    socket.to(sessionId).emit('user-joined', { username, users: session.users });
    console.log(`${username} joined session ${sessionId}`);
  });

  socket.on('code-change', ({ sessionId, code }) => {
    const session = sessions.get(sessionId);
    if (session) {
      session.code = code;
      socket.to(sessionId).emit('code-update', { code });
    }
  });

  socket.on('cursor-position', ({ sessionId, position, username }) => {
    socket.to(sessionId).emit('cursor-update', { position, username });
  });

  socket.on('language-change', ({ sessionId, language }) => {
    const session = sessions.get(sessionId);
    if (session) {
      session.language = language;
      io.to(sessionId).emit('language-update', { language });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket ready for connections`);
});
