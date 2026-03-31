import React, { useState } from 'react';
import { Ghost, ShieldCheck, Activity } from 'lucide-react';

const SafeExplore = () => {
  const [identityActive, setIdentityActive] = useState(false);

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl">Safe Explore</h1>
        <p className="text-muted">A fortified sandbox environment running in an isolated container.</p>
      </header>

      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '32px', border: identityActive ? '1px solid var(--accent-success)' : '1px solid var(--glass-border)' }}>
          <div className="flex items-center gap-4" style={{ marginBottom: '24px' }}>
            <div style={{ padding: '16px', background: identityActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', borderRadius: '16px', color: identityActive ? 'var(--accent-success)' : 'var(--text-muted)' }}>
              <Ghost size={32} />
            </div>
            <div>
              <h2 className="text-2xl">Ghost Identity</h2>
              <div className="text-muted text-sm">FinShield Cloaking Protocol</div>
            </div>
          </div>

          <p style={{ lineHeight: 1.6, marginBottom: '24px', color: 'var(--text-main)' }}>
            When toggled, this system intercepts external tracking scripts and injects a <strong>Ghost Identity</strong>. Third-party applications will profile the synthetic persona, keeping your real financial footprint entirely hidden.
          </p>

          <button 
            className={`btn ${identityActive ? 'btn-success' : 'btn-outline'}`} 
            style={{ width: '100%', padding: '16px' }}
            onClick={() => setIdentityActive(!identityActive)}
          >
            {identityActive ? 'Ghost Identity: ACTIVE' : 'Enable Ghost Identity'}
          </button>

          {identityActive && (
            <div className="glass-card animate-slide-up" style={{ marginTop: '24px', background: 'rgba(16, 185, 129, 0.05)' }}>
              <div className="mb-2 text-sm text-success flex items-center gap-2"><ShieldCheck size={16} /> Synthetic Persona Injected</div>
              <div className="flex justify-between text-sm" style={{ borderBottom: '1px solid var(--glass-border)', padding: '8px 0' }}>
                <span className="text-muted">Profile Name</span>
                <span>Alex Mercer</span>
              </div>
              <div className="flex justify-between text-sm" style={{ borderBottom: '1px solid var(--glass-border)', padding: '8px 0' }}>
                <span className="text-muted">Location</span>
                <span>Zurich, Switzerland (Node 41)</span>
              </div>
              <div className="flex justify-between text-sm" style={{ padding: '8px 0' }}>
                <span className="text-muted">Browsing Fingerprint</span>
                <span>Scrambled & Randomized</span>
              </div>
            </div>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '32px' }}>
          <h2 className="text-xl flex items-center gap-2" style={{ marginBottom: '24px' }}><Activity size={24} /> Network Telemetry</h2>
          <div className="glass-card" style={{ height: '240px', overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.875rem' }}>
            {identityActive ? (
              <div style={{ color: 'var(--accent-success)' }}>
                <div>&gt; Cloaking engaged...</div>
                <div>&gt; Spoofing MAC: EA:32:B1:09:F2</div>
                <div>&gt; Intercepting ad-trackers... [BLOCKED 14]</div>
                <div>&gt; Faking user agent... [Chrome 91 / Linux]</div>
                <div>&gt; Injecting noise into data streams... [OK]</div>
                <div className="animate-pulse-danger" style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--accent-success)', borderRadius: '50%', marginTop: '12px' }}></div>
              </div>
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>
                <div>&gt; System running in uncloaked mode.</div>
                <div>&gt; Real identity visible to third parties.</div>
                <div>&gt; Awaiting Ghost activation...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafeExplore;
