import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { getAllProblems, getProblemById } from './data/problems';
import { CodeExecutor } from './services/codeExecutor';

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

interface ChatMessage {
  username: string;
  message: string;
  timestamp: Date;
}

interface Session {
  id: string;
  users: string[];
  code: string;
  language: string;
  problem: string | null;
  createdAt: Date;
  chat: ChatMessage[];
  startTime: Date;
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
  const { code, language, testInput } = req.body;
  
  let result;
  switch (language) {
    case 'javascript':
    case 'typescript':
      result = await CodeExecutor.executeJavaScript(code, testInput);
      break;
    case 'python':
      result = await CodeExecutor.executePython(code, testInput);
      break;
    default:
      result = {
        success: false,
        error: 'Language ' + language + ' not supported yet'
      };
  }
  
  res.json(result);
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
      problem: session.problem,
      chat: session.chat,
    });

    socket.to(sessionId).emit('user-joined', { username, users: session.users });
    console.log(username + ' joined session ' + sessionId);
  });

  socket.on('code-change', ({ sessionId, code }) => {
    const session = sessions.get(sessionId);
    if (session) {
      session.code = code;
      socket.to(sessionId).emit('code-update', { code });
    }
  });

  socket.on('language-change', ({ sessionId, language }) => {
    const session = sessions.get(sessionId);
    if (session) {
      session.language = language;
      io.to(sessionId).emit('language-update', { language });
    }
  });

  socket.on('problem-select', ({ sessionId, problemId }) => {
    const session = sessions.get(sessionId);
    if (session) {
      session.problem = problemId;
      const problem = getProblemById(problemId);
      if (problem) {
        const starterCode = problem.starterCode[session.language as keyof typeof problem.starterCode] || problem.starterCode.javascript;
        session.code = starterCode;
        io.to(sessionId).emit('problem-selected', { problemId, problem, code: starterCode });
      }
    }
  });

  socket.on('chat-message', ({ sessionId, username, message }) => {
    const session = sessions.get(sessionId);
    if (session) {
      const chatMessage: ChatMessage = {
        username,
        message,
        timestamp: new Date(),
      };
      session.chat.push(chatMessage);
      io.to(sessionId).emit('chat-message', chatMessage);
    }
  });

  socket.on('request-hint', ({ sessionId, problemId }) => {
    const problem = getProblemById(problemId);
    if (problem && problem.hints.length > 0) {
      const hint = problem.hints[Math.floor(Math.random() * problem.hints.length)];
      socket.emit('hint-received', { hint });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log('Server running on http://localhost:' + PORT);
  console.log('WebSocket ready for connections');
  console.log(getAllProblems().length + ' problems loaded');
});
