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

  const featurePills = [
    { icon: Users, text: 'Real-time Collaboration' },
    { icon: Zap, text: 'Practice Interviews' },
    { icon: Code, text: 'Multiple Languages' },
  ];

  const featureCards = [
    { icon: Users, title: 'Collaborate in Real-time', desc: 'See your partners code changes instantly as they type. No refresh needed.' },
    { icon: Zap, title: 'Practice Interviews', desc: 'Simulate real coding interviews with built-in problems and timer.' },
    { icon: Code, title: 'Multiple Languages', desc: 'Support for JavaScript, TypeScript, and Python with more coming soon.' },
    { icon: Globe, title: 'Work from Anywhere', desc: 'No installation required. Just share a link and start coding together.' },
  ];

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', position: 'relative', overflow: 'auto' }}>
      
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: '400px', height: '400px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(100px)', animation: 'float 6s ease-in-out infinite' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: '500px', height: '500px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', filter: 'blur(120px)', animation: 'float 8s ease-in-out infinite reverse' }}></div>
      <div style={{ position: 'absolute', top: '50%', right: '10%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.06)', borderRadius: '50%', filter: 'blur(90px)', animation: 'float 7s ease-in-out infinite' }}></div>

      <nav style={{ padding: '1.5rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <Code size={36} color="white" strokeWidth={2.5} />
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'white', margin: 0, letterSpacing: '-0.5px' }}>CodePair</h1>
        </div>
        <a href="https://github.com/ibiraza1077-pixel/codepair" target="_blank" rel="noopener noreferrer" style={{ color: 'white', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', padding: '0.7rem 1.5rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.3s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          GitHub →
        </a>
      </nav>

      <div style={{ minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 5%', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', width: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '4rem', alignItems: 'center' }}>
          
          <div>
            <h2 style={{ fontSize: '4.5rem', fontWeight: '900', color: 'white', marginBottom: '1.5rem', lineHeight: '1.1', letterSpacing: '-2px' }}>
              THE COLLABORATIVE IDE, SOLVED
            </h2>
            <p style={{ fontSize: '1.4rem', color: 'rgba(255,255,255,0.95)', marginBottom: '3rem', lineHeight: '1.6' }}>
              Real-time collaborative coding interview platform. Practice together, code together, succeed together.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {featurePills.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', padding: '0.8rem 1.5rem', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <item.icon size={20} color="white" />
                  <span style={{ color: 'white', fontSize: '0.95rem', fontWeight: '600' }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)', borderRadius: '30px', padding: '3.5rem', boxShadow: '0 30px 90px rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#667eea', marginBottom: '2.5rem', textAlign: 'center' }}>Start Coding Together</h3>
            
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(''); }}
              style={{ width: '100%', padding: '1.1rem 1.5rem', fontSize: '1.05rem', border: '2px solid #e5e7eb', borderRadius: '14px', marginBottom: '1.2rem', outline: 'none', transition: 'all 0.3s', fontWeight: '500' }}
              onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 4px rgba(102,126,234,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />

            <button
              onClick={createSession}
              style={{ width: '100%', padding: '1.2rem 2rem', fontSize: '1.15rem', fontWeight: '700', color: 'white', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '14px', cursor: 'pointer', marginBottom: '2rem', transition: 'all 0.3s', boxShadow: '0 12px 35px rgba(102,126,234,0.35)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 45px rgba(102,126,234,0.45)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(102,126,234,0.35)'; }}
            >
              Create New Session
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' }}></div>
              <span style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: '600' }}>OR</span>
              <div style={{ flex: 1, height: '2px', background: 'linear-gradient(to right, transparent, #e5e7eb, transparent)' }}></div>
            </div>

            <input
              type="text"
              placeholder="Enter session ID to join"
              value={sessionId}
              onChange={(e) => { setSessionId(e.target.value); setError(''); }}
              style={{ width: '100%', padding: '1.1rem 1.5rem', fontSize: '1.05rem', border: '2px solid #e5e7eb', borderRadius: '14px', marginBottom: '1.2rem', outline: 'none', transition: 'all 0.3s', fontWeight: '500' }}
              onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 4px rgba(102,126,234,0.1)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />

            <button
              onClick={joinSession}
              style={{ width: '100%', padding: '1.2rem 2rem', fontSize: '1.15rem', fontWeight: '700', color: '#667eea', background: 'white', border: '2px solid #667eea', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#667eea'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#667eea'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Join Existing Session
            </button>

            {error && (
              <p style={{ color: '#ef4444', marginTop: '1.2rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center' }}>{error}</p>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '6rem 5%', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '3rem', fontWeight: '900', color: 'white', textAlign: 'center', marginBottom: '4rem', letterSpacing: '-1px' }}>
            Code Better, Faster, Together
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
            {featureCards.map((feature, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.25)', transition: 'all 0.4s', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
              >
                <div style={{ width: '70px', height: '70px', background: 'rgba(255,255,255,0.25)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.8rem' }}>
                  <feature.icon size={32} color="white" strokeWidth={2.5} />
                </div>
                <h4 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'white', marginBottom: '1rem' }}>{feature.title}</h4>
                <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: '1.7' }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '3rem 5% 4rem', color: 'rgba(255,255,255,0.8)', position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '1rem', marginBottom: '0.5rem', fontWeight: '500' }}>Built with React, TypeScript, Socket.io & Express</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>© 2026 CodePair. Made by Ibrahim.</p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

export default Home;
