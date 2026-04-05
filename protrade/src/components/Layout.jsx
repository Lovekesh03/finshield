import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, ShieldCheck, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrading } from '../context/TradingContext';

const Layout = ({ children }) => {

  const { user, logout } = useAuth();
  const { balance, notifications } = useTrading();
  const [dismissed, setDismissed] = useState([]);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const navigate = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '260px', borderRadius: 0, borderRight: '1px solid var(--glass-border)', padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="text-2xl text-gradient flex items-center gap-2">
            <ShieldCheck size={28} />
            ProTrade
          </h2>
          <button
            onClick={handleThemeToggle}
            className="btn btn-outline"
            style={{ marginLeft: 8, padding: '6px 12px', fontSize: 15 }}
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </button>
        </div>
        <span className="badge badge-success text-sm" style={{ marginBottom: '24px', display: 'inline-block', alignSelf: 'flex-start' }}>Secured by FinShield</span>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 12 }}>
          <NavLink to="/" className={({isActive}) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/trade" className={({isActive}) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
            <ArrowRightLeft size={20} /> Trade Stocks
          </NavLink>
          <NavLink to="/transfer" className={({isActive}) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
            <Wallet size={20} /> Transfer Funds
          </NavLink>
          <NavLink to="/safe-explore" className={({isActive}) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
            <ShieldCheck size={20} /> Safe Explore Tab
          </NavLink>
          <NavLink to="/profile" className={({isActive}) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`} style={{ justifyContent: 'flex-start' }}>
            <LogOut size={20} style={{ transform: 'rotate(-90deg)' }} /> Profile
          </NavLink>
        </nav>

        {/* badge moved above navigation */}

        <div className="glass-card" style={{ marginTop: 'auto', marginBottom: '16px' }}>
          <div className="text-sm text-muted">Buying Power</div>
          <div className="text-xl text-success">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid var(--glass-border)' }}>
          <div className="text-sm">
            Hello, <br/><span style={{ fontWeight: 600 }}>{user?.name}</span>
          </div>
          <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px' }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" style={{ position: 'relative' }}>
        {/* Notifications */}
        {notifications && notifications.length > 0 && (
          <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 2000, minWidth: 320 }}>
            {notifications.slice(0, 3).map((n, idx) => (
              !dismissed.includes(idx) && (
                <div key={idx} className={`badge badge-${n.type}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, padding: '16px 20px', fontSize: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                  <span>{n.message}</span>
                  <button onClick={() => setDismissed([...dismissed, idx])} style={{ background: 'none', border: 'none', fontSize: 20, marginLeft: 16, cursor: 'pointer', color: 'inherit' }}>&times;</button>
                </div>
              )
            ))}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
