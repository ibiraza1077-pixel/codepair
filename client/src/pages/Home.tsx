import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code, Zap, Users, Globe, Shield, Clock } from 'lucide-react';

function Home() {
  const [username, setUsername] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const API_URL = 'https://hearty-abundance-production.up.railway.app';

  const createSession = async () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/sessions/create`, {
        method: 'POST',
      });
      const data = await response.json();
      navigate(`/session/${data.sessionId}?username=${encodeURIComponent(username)}`);
    } catch (err) {
      setError('Failed to create session');
    }
  };

  const joinSession = () => {
    if (!username.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!sessionId.trim()) {
      setError('Please enter session ID');
      return;
    }
    navigate(`/session/${sessionId}?username=${encodeURIComponent(username)}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #0f172a 0%, #1e1b4b 50%, #312e81 100%)', color: 'white', overflow: 'auto' }}>
      
      {/* Header */}
      <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1.2rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <Code size={24} color="white" />
          <div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>CodePair</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>Collaborative IDE</div>
          </div>
        </div>
        <a href="https://github.com/ibiraza1077-pixel/codepair" target="_blank" rel="noopener noreferrer" 
          style={{ background: 'rgba(255,255,255,0.1)', padding: '0.6rem 1.5rem', borderRadius: '10px', color: 'white', textDecoration: 'none', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.3s' }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        >
          GitHub →
        </a>
      </nav>

      {/* Badge */}
      <div style={{ padding: '0 5%', marginTop: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem 1.2rem', borderRadius: '50px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
          <div style={{ width: '8px', height: '8px', background: '#3b82f6', borderRadius: '50%' }}></div>
          <span style={{ fontSize: '0.85rem', color: '#93c5fd' }}>Live coding rooms • Built for interviews</span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ padding: '3rem 5%', display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '4rem', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Left Side */}
        <div>
          <h1 style={{ fontSize: '4.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #93c5fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            The prettiest way to <span style={{ background: 'linear-gradient(to right, #60a5fa, #c084fc, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>code together</span>.
          </h1>
          
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', marginBottom: '2rem', lineHeight: '1.7' }}>
            Create a room in seconds. Pair program in real time. Practice technical interviews with the same setup you'll face in real life.
          </p>

          {/* Feature Pills */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {[
              { icon: Zap, text: 'Realtime pair coding' },
              { icon: Shield, text: 'Secure rooms' },
              { icon: Clock, text: 'Interview mode' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1.2rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <item.icon size={16} />
                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Feature Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {[
              { icon: Zap, title: 'Low-latency', subtitle: 'Socket-based sync' },
              { icon: Clock, title: 'Interview mode', subtitle: 'Timed practice' },
              { icon: Users, title: 'Shareable', subtitle: 'Link + join' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <item.icon size={20} style={{ marginBottom: '0.8rem', color: '#60a5fa' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.3rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{item.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{ background: 'rgba(30, 27, 75, 0.6)', backdropFilter: 'blur(20px)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>Start a session</h3>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>No signup • Just vibes</div>
          </div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Your name</label>
            <input
              type="text"
              placeholder="e.g. Ibrahim"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              style={{ width: '100%', padding: '0.9rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          <button
            onClick={createSession}
            style={{ width: '100%', padding: '1rem', background: 'linear-gradient(to right, #06b6d4, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '12px', color: 'white', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', marginBottom: '1.5rem', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Create new session →
          </button>

          <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>or</div>

          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', color: 'rgba(255,255,255,0.7)' }}>Session ID</label>
            <input
              type="text"
              placeholder="Paste session ID"
              value={sessionId}
              onChange={(e) => { setSessionId(e.target.value); setError(''); }}
              style={{ width: '100%', padding: '0.9rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white', fontSize: '1rem', outline: 'none' }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
            />
          </div>

          <button
            onClick={joinSession}
            style={{ width: '100%', padding: '1rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', color: 'white', fontSize: '1rem', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
          >
            Join existing →
          </button>

          {error && (
            <p style={{ color: '#f87171', marginTop: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>
          )}

          <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', background: '#8b5cf6', borderRadius: '50%' }}></div>
              Built with React + TypeScript
            </div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '6px', height: '6px', background: '#06b6d4', borderRadius: '50%' }}></div>
              Socket.io + Express backend
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{ padding: '6rem 5%', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3rem', fontWeight: '900', textAlign: 'center', marginBottom: '3rem' }}>
          Code better, faster, together.
        </h2>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', marginBottom: '4rem', maxWidth: '600px', margin: '0 auto 4rem' }}>
          Everything you need for pair practice and real interview reps.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { icon: Users, title: 'Collaborate instantly', desc: 'See changes live as you type — low-latency socket syncing means zero lag.' },
            { icon: Zap, title: 'Interview-ready', desc: 'Timers, prompts, and structured problems just like the real thing.' },
            { icon: Code, title: 'Multi-language', desc: 'JavaScript, TypeScript, Python — write in the language you interview in.' },
            { icon: Globe, title: 'Link + go', desc: 'Share a session link and start coding together. No signup, no friction.' },
          ].map((feature, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(-5px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '50px', height: '50px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <feature.icon size={24} color="#60a5fa" />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.8rem' }}>{feature.title}</h4>
              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '3rem 5%', borderTop: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
        <p>© 2026 CodePair. Made by Ibrahim.</p>
      </div>
    </div>
  );
}

export default Home;
