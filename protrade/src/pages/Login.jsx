import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('demo@protrade.app');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Demo User');
  const [error, setError] = useState('');
  
  const { login, register, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" />;
  }

  // Password Strength Checker
  const checkPasswordStrength = (pass) => {
    let score = 0;
    if (!pass) return score;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    return score;
  };

  const strengthScore = checkPasswordStrength(password);
  
  const getStrengthMeta = () => {
    if (strengthScore <= 2) return { text: 'Weak', color: 'var(--accent-danger)' };
    if (strengthScore === 3 || strengthScore === 4) return { text: 'Medium', color: 'var(--accent-warning)' };
    return { text: 'Strong', color: 'var(--accent-success)' };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isLogin) {
      if (strengthScore < 4) {
        setError('Trading accounts require a strong password (minimum 8 chars, uppercase, lowercase, numbers & special character).');
        return;
      }
      if (register(name, email, password)) navigate('/');
    } else {
      if (login(email, password)) navigate('/');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 className="text-3xl text-gradient flex justify-center items-center gap-2" style={{ marginBottom: '8px' }}>
            <ShieldCheck size={36} /> ProTrade
          </h1>
          <p className="text-muted">{isLogin ? 'Welcome back! Please sign in.' : 'Create your secure trading account.'}</p>
        </div>

        {error && (
          <div className="badge badge-danger flex items-center gap-2" style={{ padding: '12px', marginBottom: '20px', display: 'flex', textAlign: 'left', lineHeight: 1.4 }}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          
          <div className="input-group">
            <label>Password</label>
            <input type="password" className="input-field" value={password} onChange={e => {setPassword(e.target.value); setError('');}} required />
            
            {!isLogin && password.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span className="text-xs text-muted">Password Security Level</span>
                  <span className="text-xs" style={{ color: getStrengthMeta().color, fontWeight: 600 }}>{getStrengthMeta().text}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', display: 'flex' }}>
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      style={{ 
                        flex: 1, 
                        background: i < strengthScore ? getStrengthMeta().color : 'transparent',
                        borderRight: i < 4 ? '1px solid var(--bg-dark)' : 'none',
                        transition: 'var(--transition)'
                      }} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}>
            {isLogin ? 'Sign In Securely' : 'Create Secure Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p className="text-sm text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Sign up' : 'Sign in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
