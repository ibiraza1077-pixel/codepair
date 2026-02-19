import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Code, Zap, Globe } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(80px)' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(100px)' }}></div>

      <nav style={{ padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code size={32} color="white" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', margin: 0 }}>CodePair</h1>
        </div>
        <a href="https://github.com/ibiraza1077-pixel/codepair" target="_blank" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '500' }}>GitHub</a>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: '800', color: 'white', marginBottom: '1.5rem', lineHeight: '1.2' }}>
            THE COLLABORATIVE IDE, SOLVED
          </h2>
          <p style={{ fontSize: '1.3rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 3rem' }}>
            Real-time collaborative coding interview platform. Practice together, code together, succeed together.
          </p>

          <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: '24px', padding: '3rem', maxWidth: '500px', margin: '0 auto', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#667eea', marginBottom: '2rem' }}>Start Coding Together</h3>
            
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              style={{ width: '100%', padding: '1rem 1.5rem', fontSize: '1rem', border: '2px solid #e5e7eb', borderRadius: '12px', marginBottom: '1rem', outline: 'none', transition: 'all 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />

            <button
              onClick={createSession}
              style={{ width: '100%', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: '600', color: 'white', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '12px', cursor: 'pointer', marginBottom: '1.5rem', transition: 'transform 0.2s', boxShadow: '0 10px 30px rgba(102,126,234,0.4)' }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Create New Session
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
              <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: '500' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }}></div>
            </div>

            <input
              type="text"
              placeholder="Enter session ID to join"
              value={sessionId}
              onChange={(e) => { setSessionId(e.target.value); setError(''); }}
              style={{ width: '100%', padding: '1rem 1.5rem', fontSize: '1rem', border: '2px solid #e5e7eb', borderRadius: '12px', marginBottom: '1rem', outline: 'none', transition: 'all 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />

            <button
              onClick={joinSession}
              style={{ width: '100%', padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: '600', color: '#667eea', background: 'white', border: '2px solid #667eea', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#667eea'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#667eea'; }}
            >
              Join Existing Session
            </button>

            {error && (
              <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem', fontWeight: '500' }}>{error}</p>
            )}
          </div>
        </div>

        <div style={{ marginTop: '6rem' }}>
          <h3 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', textAlign: 'center', marginBottom: '3rem' }}>
            Code Better, Faster, Together
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              { icon: Users, title: 'Collaborate in Real-time', desc: 'See your partners code changes instantly as they type. No refresh needed.' },
              { icon: Zap, title: 'Practice Interviews', desc: 'Simulate real coding interviews with built-in problems and timer.' },
              { icon: Code, title: 'Multiple Languages', desc: 'Support for JavaScript, TypeScript, and Python with more coming soon.' },
              { icon: Globe, title: 'Work from Anywhere', desc: 'No installation required. Just share a link and start coding together.' },
            ].map((feature, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)', transition: 'transform 0.3s' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.2)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <feature.icon size={28} color="white" />
                </div>
                <h4 style={{ fontSize: '1.3rem', fontWeight: '700', color: 'white', marginBottom: '0.8rem' }}>{feature.title}</h4>
                <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.7)', position: 'relative', zIndex: 10 }}>
        <p style={{ fontSize: '0.9rem' }}>Built with React, TypeScript, Socket.io & Express</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>© 2026 CodePair. Made by Ibrahim.</p>
      </div>
    </div>
  );
}

export default Home;
