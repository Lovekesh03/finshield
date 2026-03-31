import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ArrowRightLeft, ShieldCheck, LogOut, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrading } from '../context/TradingContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { balance } = useTrading();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="glass-panel" style={{ width: '260px', borderRadius: 0, borderRight: '1px solid var(--glass-border)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 className="text-2xl text-gradient flex items-center gap-2">
            <ShieldCheck size={28} />
            ProTrade
          </h2>
          <span className="badge badge-success text-sm" style={{ marginTop: '8px', display: 'inline-block' }}>Secured by FinShield</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
        </nav>

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
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
