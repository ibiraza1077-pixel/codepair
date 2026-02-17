import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { Users, Copy, CheckCircle, Play, Lightbulb, MessageSquare, BookOpen, Timer, ChevronDown, ChevronUp } from 'lucide-react';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000';

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  hints: string[];
  topics: string[];
}

interface ChatMessage {
  username: string;
  message: string;
  timestamp: Date;
}

function Session() {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || 'Anonymous';

  const [code, setCode] = useState('// Start coding here...\n');
  const [language, setLanguage] = useState('javascript');
  const [users, setUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [showProblems, setShowProblems] = useState(false);
  const [showProblem, setShowProblem] = useState(true);

  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [outputError, setOutputError] = useState(false);

  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [showChat, setShowChat] = useState(false);

  const [hint, setHint] = useState('');
  const [showHint, setShowHint] = useState(false);

  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetch(API_URL + '/api/problems')
      .then(r => r.json())
      .then(data => setProblems(data.problems));
  }, []);

  useEffect(() => {
    if (timerRunning) {
      const interval = setInterval(() => setSeconds(s => s + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timerRunning]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join-session', { sessionId, username });
    });

    socket.on('session-joined', ({ code: c, language: l, users: u, chat: ch }) => {
      setCode(c);
      setLanguage(l);
      setUsers(u);
      if (ch) setChat(ch);
    });

    socket.on('user-joined', ({ users: u }) => setUsers(u));
    socket.on('code-update', ({ code: c }) => setCode(c));
    socket.on('language-update', ({ language: l }) => setLanguage(l));

    socket.on('problem-selected', ({ problem, code: c }) => {
      setCurrentProblem(problem);
      setCode(c);
      setShowProblems(false);
      setShowProblem(true);
    });

    socket.on('chat-message', (msg: ChatMessage) => {
      setChat(prev => [...prev, msg]);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    socket.on('hint-received', ({ hint: h }) => {
      setHint(h);
      setShowHint(true);
    });

    return () => { socket.disconnect(); };
  }, [sessionId, username]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      socketRef.current?.emit('code-change', { sessionId, code: value });
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const l = e.target.value;
    setLanguage(l);
    socketRef.current?.emit('language-change', { sessionId, language: l });
  };

  const selectProblem = (problemId: string) => {
    socketRef.current?.emit('problem-select', { sessionId, problemId });
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('Running...');
    setOutputError(false);
    try {
      const res = await fetch(API_URL + '/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      if (data.success) {
        setOutput(data.output || 'No output');
        setOutputError(false);
      } else {
        setOutput(data.error || 'Error running code');
        setOutputError(true);
      }
    } catch {
      setOutput('Failed to connect to server');
      setOutputError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const requestHint = () => {
    if (currentProblem) {
      socketRef.current?.emit('request-hint', { sessionId, problemId: currentProblem.id });
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      socketRef.current?.emit('chat-message', { sessionId, username, message: chatMessage });
      setChatMessage('');
    }
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m + ':' + (sec < 10 ? '0' + sec : sec);
  };

  const difficultyColor = (d: string) => {
    if (d === 'Easy') return '#4ec9b0';
    if (d === 'Medium') return '#ce9178';
    return '#f44747';
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1e1e1e' }}>

      {/* HEADER */}
      <div style={{ background: '#252526', padding: '0.6rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #3e3e42', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#007acc' }}>CodePair</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ color: '#888', fontSize: '0.8rem' }}>Session:</span>
            <code style={{ background: '#1e1e1e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.75rem' }}>{sessionId?.slice(0, 8)}...</code>
            <button onClick={copySessionId} style={{ background: 'transparent', padding: '0.2rem', display: 'flex' }}>
              {copied ? <CheckCircle size={14} color="#4ec9b0" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Timer size={16} color="#888" />
            <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: timerRunning ? '#4ec9b0' : '#888' }}>{formatTime(seconds)}</span>
            <button onClick={() => setTimerRunning(!timerRunning)} style={{ background: '#2d2d2d', color: 'white', padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>
              {timerRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={() => { setSeconds(0); setTimerRunning(false); }} style={{ background: '#2d2d2d', color: '#888', padding: '0.2rem 0.5rem', fontSize: '0.75rem', borderRadius: '4px' }}>
              Reset
            </button>
          </div>

          {/* Language */}
          <select value={language} onChange={handleLanguageChange} style={{ background: '#2d2d2d', color: 'white', border: '1px solid #444', borderRadius: '4px', padding: '0.3rem', fontSize: '0.85rem' }}>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          {/* Users */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={16} />
            <span style={{ fontSize: '0.85rem' }}>{users.length}</span>
            {connected && <span style={{ width: '8px', height: '8px', background: '#4ec9b0', borderRadius: '50%', display: 'inline-block' }}></span>}
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT PANEL - Problem */}
        <div style={{ width: '380px', flexShrink: 0, display: 'flex', flexDirection: 'column', borderRight: '1px solid #3e3e42', overflow: 'hidden' }}>

          {/* Problem Selector Button */}
          <div style={{ padding: '0.75rem', borderBottom: '1px solid #3e3e42', display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowProblems(!showProblems)}
              style={{ flex: 1, background: '#007acc', color: 'white', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
            >
              <BookOpen size={14} />
              {currentProblem ? 'Change Problem' : 'Select Problem'}
              {showProblems ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {currentProblem && (
              <button onClick={requestHint} style={{ background: '#2d2d2d', color: '#ffd700', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', border: '1px solid #444' }}>
                <Lightbulb size={14} />
                Hint
              </button>
            )}
          </div>

          {/* Problem List Dropdown */}
          {showProblems && (
            <div style={{ background: '#252526', border: '1px solid #3e3e42', borderRadius: '6px', margin: '0.5rem', overflow: 'hidden', zIndex: 10 }}>
              {problems.map(p => (
                <div
                  key={p.id}
                  onClick={() => selectProblem(p.id)}
                  style={{ padding: '0.75rem 1rem', cursor: 'pointer', borderBottom: '1px solid #3e3e42', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#2d2d2d')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '0.9rem' }}>{p.title}</span>
                  <span style={{ fontSize: '0.75rem', color: difficultyColor(p.difficulty), fontWeight: 'bold' }}>{p.difficulty}</span>
                </div>
              ))}
            </div>
          )}

          {/* Hint */}
          {showHint && hint && (
            <div style={{ margin: '0.5rem', padding: '0.75rem', background: '#2d2d2d', borderRadius: '6px', border: '1px solid #ffd700', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#ffd700', fontWeight: 'bold' }}>💡 Hint</span>
                <button onClick={() => setShowHint(false)} style={{ background: 'transparent', color: '#888', padding: 0, fontSize: '1rem' }}>×</button>
              </div>
              <p style={{ color: '#ccc', lineHeight: '1.4' }}>{hint}</p>
            </div>
          )}

          {/* Problem Description */}
          {currentProblem && showProblem && (
            <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem' }}>{currentProblem.title}</h3>
                <span style={{ fontSize: '0.8rem', color: difficultyColor(currentProblem.difficulty), fontWeight: 'bold', background: '#2d2d2d', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                  {currentProblem.difficulty}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {currentProblem.topics.map(t => (
                  <span key={t} style={{ background: '#007acc22', color: '#007acc', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>{t}</span>
                ))}
              </div>

              <p style={{ color: '#ccc', lineHeight: '1.6', fontSize: '0.875rem', marginBottom: '1rem', whiteSpace: 'pre-line' }}>{currentProblem.description}</p>

              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#888' }}>Examples:</h4>
              {currentProblem.examples.map((ex, i) => (
                <div key={i} style={{ background: '#2d2d2d', padding: '0.75rem', borderRadius: '6px', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                  <div><span style={{ color: '#888' }}>Input: </span><code style={{ color: '#9cdcfe' }}>{ex.input}</code></div>
                  <div><span style={{ color: '#888' }}>Output: </span><code style={{ color: '#4ec9b0' }}>{ex.output}</code></div>
                  {ex.explanation && <div style={{ color: '#888', marginTop: '0.3rem' }}>{ex.explanation}</div>}
                </div>
              ))}

              <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#888', marginTop: '1rem' }}>Constraints:</h4>
              <ul style={{ paddingLeft: '1rem', fontSize: '0.8rem', color: '#ccc' }}>
                {currentProblem.constraints.map((c, i) => (
                  <li key={i} style={{ marginBottom: '0.3rem' }}>{c}</li>
                ))}
              </ul>
            </div>
          )}

          {!currentProblem && !showProblems && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555', flexDirection: 'column', gap: '0.5rem' }}>
              <BookOpen size={40} />
              <p style={{ fontSize: '0.9rem' }}>Select a problem to begin</p>
            </div>
          )}
        </div>

        {/* CENTER - Editor + Output */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Editor */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleCodeChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'Fira Code, Menlo, Monaco, Courier New, monospace',
                lineNumbers: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
              }}
            />
          </div>

          {/* Run Button + Output */}
          <div style={{ background: '#252526', borderTop: '1px solid #3e3e42', flexShrink: 0 }}>
            <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #3e3e42' }}>
              <button
                onClick={runCode}
                disabled={isRunning}
                style={{ background: '#4ec9b0', color: '#1e1e1e', padding: '0.4rem 1rem', borderRadius: '6px', fontWeight: 'bold', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Play size={14} />
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <span style={{ color: '#888', fontSize: '0.8rem' }}>JavaScript & TypeScript only (Python coming soon)</span>
            </div>
            <div style={{ padding: '0.75rem 1rem', minHeight: '80px', maxHeight: '150px', overflow: 'auto', fontFamily: 'monospace', fontSize: '0.85rem', color: outputError ? '#f44747' : '#4ec9b0', whiteSpace: 'pre-wrap' }}>
              {output || 'Output will appear here...'}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Chat + Participants */}
        <div style={{ width: '260px', flexShrink: 0, display: 'flex', flexDirection: 'column', borderLeft: '1px solid #3e3e42' }}>

          {/* Participants */}
          <div style={{ padding: '0.75rem', borderBottom: '1px solid #3e3e42' }}>
            <h4 style={{ fontSize: '0.85rem', marginBottom: '0.5rem', color: '#888' }}>Participants ({users.length})</h4>
            {users.map((u, i) => (
              <div key={i} style={{ padding: '0.3rem 0', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '8px', height: '8px', background: '#4ec9b0', borderRadius: '50%', display: 'inline-block' }}></span>
                {u} {u === username && <span style={{ color: '#888', fontSize: '0.75rem' }}>(you)</span>}
              </div>
            ))}
          </div>

          {/* Chat Header */}
          <div
            style={{ padding: '0.75rem', borderBottom: '1px solid #3e3e42', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
            onClick={() => setShowChat(!showChat)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={16} color="#888" />
              <h4 style={{ fontSize: '0.85rem', color: '#888' }}>Chat</h4>
            </div>
            {showChat ? <ChevronUp size={14} color="#888" /> : <ChevronDown size={14} color="#888" />}
          </div>

          {/* Chat Messages */}
          {showChat && (
            <>
              <div style={{ flex: 1, overflow: 'auto', padding: '0.5rem' }}>
                {chat.length === 0 && (
                  <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>No messages yet</p>
                )}
                {chat.map((msg, i) => (
                  <div key={i} style={{ marginBottom: '0.5rem' }}>
                    <span style={{ color: '#007acc', fontSize: '0.75rem', fontWeight: 'bold' }}>{msg.username}: </span>
                    <span style={{ color: '#ccc', fontSize: '0.8rem' }}>{msg.message}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              <div style={{ padding: '0.5rem', borderTop: '1px solid #3e3e42', display: 'flex', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  style={{ flex: 1, padding: '0.4rem', fontSize: '0.8rem', background: '#2d2d2d', border: '1px solid #444', borderRadius: '4px', color: 'white' }}
                />
                <button onClick={sendMessage} style={{ background: '#007acc', color: 'white', padding: '0.4rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Session;
