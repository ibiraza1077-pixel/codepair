import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Users, Zap } from 'lucide-react';

const API_URL = 'http://localhost:5000';

function Home() {
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createSession = async () => {
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/sessions/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      navigate(`/session/${data.sessionId}?username=${username}`);
    } catch (error) {
      console.error('Error creating session:', error);
      alert('Failed to create session');
    } finally {
      setLoading(false);
    }
  };

  const joinSession = () => {
    if (!username.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!sessionId.trim()) {
      alert('Please enter session ID');
      return;
    }
    navigate(`/session/${sessionId}?username=${username}`);
  };

  return (
    <div className="container" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          <Code2 size={48} />
          CodePair
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#888' }}>
          Real-time collaborative coding interview platform
        </p>
      </div>

      <div style={{ display: 'flex', gap: '3rem', justifyContent: 'center', marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={24} color="#007acc" />
          <span>Collaborate in Real-time</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Zap size={24} color="#007acc" />
          <span>Practice Interviews</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code2 size={24} color="#007acc" />
          <span>Multiple Languages</span>
        </div>
      </div>

      <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <input
            type="text"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: '1rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button
            className="btn-primary"
            onClick={createSession}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Creating...' : 'Create New Session'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
            <span style={{ color: '#888' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#444' }}></div>
          </div>

          <input
            type="text"
            placeholder="Enter session ID to join"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
          />
          <button
            className="btn-secondary"
            onClick={joinSession}
            style={{ width: '100%' }}
          >
            Join Existing Session
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
