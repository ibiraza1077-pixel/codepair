import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { randomUUID as uuidv4 } from 'node:crypto';
import { getAllProblems, getProblemById } from './data/problems';
import { CodeExecutor } from './services/codeExecutor';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

interface ChatMessage {
  username: string;
  message: string;
  timestamp: Date;
}

interface SessionUser {
  socketId: string;
  username: string;
}

interface Session {
  id: string;
  users: SessionUser[];
  code: string;
  language: string;
  problem: string | null;
  createdAt: Date;
  chat: ChatMessage[];
  startTime: Date;
}

const sessions = new Map<string, Session>();

app.get('/', (req, res) => {
  res.json({ message: 'CodePair API is running', status: 'ok' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CodePair server is running' });
});

app.post('/api/sessions/create', (req, res) => {
  for (const [id, session] of sessions) {
    if (!session.users.length && Date.now() - session.createdAt.getTime() > 24 * 60 * 60 * 1000) sessions.delete(id);
  }
  if (sessions.size >= 1000) return res.status(503).json({ error: 'Session capacity reached. Try again later.' });
  const sessionId = uuidv4();
  const session: Session = {
    id: sessionId,
    users: [],
    code: '// Start coding here...\n',
    language: 'javascript',
    problem: null,
    createdAt: new Date(),
    chat: [],
    startTime: new Date(),
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

app.get('/api/problems', (req, res) => {
  const problems = getAllProblems();
  res.json({ problems });
});

app.get('/api/problems/:id', (req, res) => {
  const problem = getProblemById(req.params.id);
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }
  res.json({ problem });
});

app.post('/api/execute', async (req, res) => {
  const { code, language } = req.body || {};
  const result = await CodeExecutor.execute(code, language);
  res.json(result);
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-session', (payload = {}) => {
    const { sessionId, username } = payload || {};
    if (typeof sessionId !== 'string' || typeof username !== 'string' || !username.trim() || username.length > 80) return;
    const session = sessions.get(sessionId);
    if (!session) {
      socket.emit('error', { message: 'Session not found' });
      return;
    }

    if (socket.data.sessionId && socket.data.sessionId !== sessionId) {
      const old = sessions.get(socket.data.sessionId);
      if (old) {
        old.users = old.users.filter(u => u.socketId !== socket.id);
        socket.to(old.id).emit('user-left', { username: socket.data.username, users: old.users.map(u => u.username) });
      }
      socket.leave(socket.data.sessionId);
    }
    session.users = session.users.filter(u => u.socketId !== socket.id);
    session.users.push({ socketId: socket.id, username });
    socket.join(sessionId);

    socket.data.sessionId = sessionId;
    socket.data.username = username;

    const usernames = session.users.map(u => u.username);

    socket.emit('session-joined', {
      sessionId,
      code: session.code,
      language: session.language,
      users: usernames,
      problem: session.problem,
      selectedProblem: session.problem ? getProblemById(session.problem) : null,
      chat: session.chat,
    });

    socket.to(sessionId).emit('user-joined', { username, users: usernames });
    console.log(username + ' joined session ' + sessionId);
  });

  socket.on('code-change', (payload = {}) => {
    const { sessionId, code } = payload || {};
    if (socket.data.sessionId !== sessionId || !socket.rooms.has(sessionId) || typeof code !== 'string' || code.length > 32000) return;
    const session = sessions.get(sessionId);
    if (session) {
      session.code = code;
      socket.to(sessionId).emit('code-update', { code });
    }
  });

  socket.on('language-change', (payload = {}) => {
    const { sessionId, language } = payload || {};
    if (socket.data.sessionId !== sessionId || !socket.rooms.has(sessionId) || !['javascript','typescript','python','java','cpp'].includes(language)) return;
    const session = sessions.get(sessionId);
    if (session) {
      session.language = language;
      io.to(sessionId).emit('language-update', { language });
    }
  });

  socket.on('problem-select', (payload = {}) => {
    const { sessionId, problemId } = payload || {};
    if (socket.data.sessionId !== sessionId || !socket.rooms.has(sessionId) || typeof problemId !== 'string') return;
    const session = sessions.get(sessionId);
    if (session) {
      const problem = getProblemById(problemId);
      if (problem) {
        session.problem = problemId;
        const starterCode = problem.starterCode[session.language as keyof typeof problem.starterCode] || problem.starterCode.javascript;
        session.code = starterCode;
        io.to(sessionId).emit('problem-selected', { problemId, problem, code: starterCode });
      }
    }
  });

  socket.on('chat-message', (payload = {}) => {
    const { sessionId, message } = payload || {};
    if (socket.data.sessionId !== sessionId || !socket.rooms.has(sessionId) || typeof message !== 'string' || !message.trim() || message.length > 2000) return;
    const session = sessions.get(sessionId);
    if (session) {
      const chatMessage: ChatMessage = { username: socket.data.username, message, timestamp: new Date() };
      session.chat.push(chatMessage);
      session.chat = session.chat.slice(-100);
      io.to(sessionId).emit('chat-message', chatMessage);
    }
  });

  socket.on('request-hint', (payload = {}) => {
    const { sessionId, problemId } = payload || {};
    if (socket.data.sessionId !== sessionId || !socket.rooms.has(sessionId) || typeof problemId !== 'string') return;
    const problem = getProblemById(problemId);
    if (problem && problem.hints.length > 0) {
      const hint = problem.hints[Math.floor(Math.random() * problem.hints.length)];
      socket.emit('hint-received', { hint });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    const sessionId = socket.data.sessionId;
    const username = socket.data.username;

    if (sessionId) {
      const session = sessions.get(sessionId);
      if (session) {
        session.users = session.users.filter(u => u.socketId !== socket.id);
        const usernames = session.users.map(u => u.username);
        io.to(sessionId).emit('user-left', { username, users: usernames });
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
if (require.main === module) server.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
  console.log('WebSocket ready for connections');
  console.log(getAllProblems().length + ' problems loaded');
});

export { app, server, io };
