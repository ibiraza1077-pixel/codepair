import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Code, Zap, Globe, ArrowRight, Sparkles, ShieldCheck, Timer } from "lucide-react";
import "./Home.css";

function Home() {
  const [username, setUsername] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_URL = "https://hearty-abundance-production.up.railway.app";

  const createSession = async () => {
    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/sessions/create`, { method: "POST" });
      const data = await response.json();
      navigate(`/session/${data.sessionId}?username=${encodeURIComponent(username)}`);
    } catch {
      setError("Failed to create session");
    }
  };

  const joinSession = () => {
    if (!username.trim()) {
      setError("Please enter your name");
      return;
    }
    if (!sessionId.trim()) {
      setError("Please enter session ID");
      return;
    }
    navigate(`/session/${sessionId}?username=${encodeURIComponent(username)}`);
  };

  const pills = useMemo(
    () => [
      { icon: Sparkles, text: "Realtime pair coding" },
      { icon: ShieldCheck, text: "Secure rooms" },
      { icon: Timer, text: "Interview mode" },
    ],
    []
  );

  const features = useMemo(
    () => [
      { icon: Users, title: "Collaborate instantly", desc: "See changes live as you type — low-latency, no refresh." },
      { icon: Zap, title: "Interview-ready", desc: "Timers, prompts, and structured practice to simulate real rounds." },
      { icon: Code, title: "Multi-language", desc: "JavaScript, TypeScript, Python — more on the way." },
      { icon: Globe, title: "Link + go", desc: "Share a session link and start coding from anywhere." },
    ],
    []
  );

  return (
    <div className="cp">
      {/* Background */}
      <div className="cp-bg" aria-hidden="true">
        <div className="cp-aurora" />
        <div className="cp-grid" />
        <div className="cp-grain" />
        <div className="cp-orb cp-orb--a" />
        <div className="cp-orb cp-orb--b" />
        <div className="cp-orb cp-orb--c" />
      </div>

      {/* Top nav */}
      <nav className="cp-nav">
        <div className="cp-brand">
          <div className="cp-logo">
            <Code size={22} />
          </div>
          <div className="cp-brandText">
            <span className="cp-brandName">CodePair</span>
            <span className="cp-brandTag">Collaborative IDE</span>
          </div>
        </div>

        <a
          className="cp-navLink"
          href="https://github.com/ibiraza1077-pixel/codepair"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <ArrowRight size={16} />
        </a>
      </nav>

      {/* Hero */}
      <main className="cp-main">
        <section className="cp-hero">
          {/* Left */}
          <div className="cp-left">
            <div className="cp-badge">
              <span className="cp-badgeDot" />
              <span>Live coding rooms • Built for interviews</span>
            </div>

            <h1 className="cp-title">
              The <span className="cp-titleGlow">prettiest</span> way to{" "}
              <span className="cp-titleGradient">code together</span>.
            </h1>

            <p className="cp-subtitle">
              Create a room in seconds. Pair program in real time. Practice technical interviews with the same setup you’ll
              face in real life.
            </p>

            <div className="cp-pills">
              {pills.map((p, i) => (
                <div key={i} className="cp-pill">
                  <p.icon size={16} />
                  <span>{p.text}</span>
                </div>
              ))}
            </div>

            <div className="cp-metrics">
              <div className="cp-metric">
                <div className="cp-metricTop">⚡ Low-latency</div>
                <div className="cp-metricBottom">Socket-based sync</div>
              </div>
              <div className="cp-metric">
                <div className="cp-metricTop">🧠 Interview mode</div>
                <div className="cp-metricBottom">Timed practice</div>
              </div>
              <div className="cp-metric">
                <div className="cp-metricTop">🔗 Shareable</div>
                <div className="cp-metricBottom">Link + join</div>
              </div>
            </div>
          </div>

          {/* Right - Card */}
          <div className="cp-cardWrap">
            <div className="cp-card">
              <div className="cp-cardTop">
                <div className="cp-cardTitle">Start a session</div>
                <div className="cp-cardHint">No signup • Just vibes</div>
              </div>

              <label className="cp-label">Your name</label>
              <div className="cp-inputWrap">
                <input
                  className="cp-input"
                  type="text"
                  placeholder="e.g. Ibrahim"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  autoComplete="name"
                />
                <div className="cp-inputGlow" aria-hidden="true" />
              </div>

              <button className="cp-btn cp-btnPrimary" onClick={createSession}>
                Create new session <ArrowRight size={18} />
              </button>

              <div className="cp-divider">
                <span />
                <em>or</em>
                <span />
              </div>

              <label className="cp-label">Session ID</label>
              <div className="cp-inputWrap">
                <input
                  className="cp-input"
                  type="text"
                  placeholder="Paste session ID"
                  value={sessionId}
                  onChange={(e) => {
                    setSessionId(e.target.value);
                    setError("");
                  }}
                />
                <div className="cp-inputGlow" aria-hidden="true" />
              </div>

              <button className="cp-btn cp-btnGhost" onClick={joinSession}>
                Join existing <ArrowRight size={18} />
              </button>

              {error && <div className="cp-error">{error}</div>}

              <div className="cp-cardFoot">
                <div className="cp-mini">
                  <span className="cp-miniDot" />
                  <span>Built with React + TypeScript</span>
                </div>
                <div className="cp-mini">
                  <span className="cp-miniDot" />
                  <span>Socket.io + Express backend</span>
                </div>
              </div>
            </div>

            <div className="cp-floatChip" aria-hidden="true">
              <Zap size={16} /> Live Sync
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="cp-features">
          <div className="cp-featuresHeader">
            <h2>Code better, faster, together.</h2>
            <p>Everything you need for pair practice and real interview reps.</p>
          </div>

          <div className="cp-featureGrid">
            {[
              { icon: Users, title: "Collaborate instantly", desc: "See changes live as you type — low-latency, no refresh." },
              { icon: Zap, title: "Interview-ready", desc: "Timers, prompts, and structured practice to simulate real rounds." },
              { icon: Code, title: "Multi-language", desc: "JavaScript, TypeScript, Python — more on the way." },
              { icon: Globe, title: "Link + go", desc: "Share a session link and start coding from anywhere." },
            ].map((f, i) => (
              <article key={i} className="cp-featureCard">
                <div className="cp-featureIcon">
                  <f.icon size={20} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="cp-footer">
          <div className="cp-footerLine" />
          <div className="cp-footerInner">
            <div>© 2026 CodePair • Made by Ibrahim</div>
            <div className="cp-footerRight">React • TypeScript • Socket.io • Express</div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default Home;
