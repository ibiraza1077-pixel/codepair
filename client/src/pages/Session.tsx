import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import Editor from '@monaco-editor/react';
import { Users, Copy, CheckCircle } from 'lucide-react';

const SOCKET_URL = 'http://localhost:5000';

function Session() {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const username = searchParams.get('username') || 'Anonymous';

  const [code, setCode] = useState('// Start coding here...\n');
  const [language, setLanguage] = useState('javascript');
  const [users, setUsers] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setConnected(true);
      socket.emit('join-session', { sessionId, username });
    });

    socket.on('session-joined', ({ code: initialCode, language: initialLang, users: initialUsers }) => {
      setCode(initialCode);
      setLanguage(initialLang);
      setUsers(initialUsers);
    });

    socket.on('user-joined', ({ username: newUser, users: updatedUsers }) => {
      setUsers(updatedUsers);
      console.log(`${newUser} joined the session`);
    });

    socket.on('code-update', ({ code: newCode }) => {
      setCode(newCode);
    });

    socket.on('language-update', ({ language: newLanguage }) => {
      setLanguage(newLanguage);
    });

    socket.on('error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.disconnect();
    };
  }, [sessionId, username]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value);
      socketRef.current?.emit('code-change', { sessionId, code: value });
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    socketRef.current?.emit('language-change', { sessionId, language: newLanguage });
  };

  const copySessionId = () => {
    navigator.clipboard.writeText(sessionId || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        background: '#252526',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #3e3e42'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <h2>CodePair</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#888', fontSize: '0.9rem' }}>Session ID:</span>
            <code style={{ background: '#1e1e1e', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
              {sessionId}
            </code>
            <button
              onClick={copySessionId}
              style={{ background: 'transparent', padding: '0.25rem', display: 'flex', alignItems: 'center' }}
            >
              {copied ? <CheckCircle size={16} color="#4ec9b0" /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <select
            value={language}
            onChange={handleLanguageChange}
            style={{
              background: '#2d2d2d',
              color: 'white',
              border: '1px solid #444',
              borderRadius: '4px',
              padding: '0.5rem',
              cursor: 'pointer'
            }}
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} />
            <span>{users.length} online</span>
            {connected && (
              <span style={{
                width: '8px',
                height: '8px',
                background: '#4ec9b0',
                borderRadius: '50%',
                display: 'inline-block'
              }}></span>
            )}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={handleCodeChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            fontFamily: 'Fira Code, Menlo, Monaco, Courier New, monospace',
            lineNumbers: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </div>

      <div style={{
        position: 'absolute',
        right: '20px',
        top: '80px',
        background: '#252526',
        padding: '1rem',
        borderRadius: '8px',
        border: '1px solid #3e3e42',
        minWidth: '150px'
      }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Participants</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {users.map((user, idx) => (
            <li key={idx} style={{ padding: '0.25rem 0', fontSize: '0.85rem', color: '#ccc' }}>
              • {user}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Session;
