import React, { useState, useEffect, useRef } from 'react';
import { useTrading } from '../context/TradingContext';
import { TrendingUp, TrendingDown, DollarSign, Briefcase, Clock } from 'lucide-react';

const Dashboard = () => {
  const { balance, portfolio, stocks, transactions, depositFunds } = useTrading();
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositError, setDepositError] = useState('');
  const [depositSuccess, setDepositSuccess] = useState('');

  const totalPortfolioValue = portfolio.reduce((acc, holding) => {
    const currentPrice = stocks.find(s => s.symbol === holding.symbol)?.price || holding.avgPrice;
    return acc + (holding.shares * currentPrice);
  }, 0);

  const totalNetWorth = balance + totalPortfolioValue;

  const handleDeposit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      setDepositError('Enter a valid amount');
      setDepositSuccess('');
      return;
    }
    const res = depositFunds(amt);
    if (res.success) {
      setDepositSuccess(`Successfully deposited $${amt.toLocaleString()}`);
      setDepositError('');
      setDepositAmount('');
      setTimeout(() => { setShowDeposit(false); setDepositSuccess(''); }, 1200);
    } else {
      setDepositError(res.error);
      setDepositSuccess('');
    }
  };

  // Ref for modal content to prevent closing when clicking inside
  const modalContentRef = useRef(null);

  // Close modal on Escape key
  useEffect(() => {
    if (!showDeposit) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowDeposit(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showDeposit]);

  // Handler for clicking overlay
  const handleOverlayClick = (e) => {
    if (modalContentRef.current && !modalContentRef.current.contains(e.target)) {
      setShowDeposit(false);
    }
  };

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl">Portfolio Dashboard</h1>
        <p className="text-muted">Welcome to your ProTrade dashboard.</p>
      </header>

      <div className="grid-3" style={{ marginBottom: '32px', position: 'relative' }}>
        <div className="glass-panel" style={{ padding: '24px', position: 'relative' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
              <DollarSign size={24} />
            </div>
            <h3 className="text-muted">Total Net Worth</h3>
          </div>
          <div className="text-3xl" style={{ fontWeight: 800 }}>${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <button className="btn btn-success" style={{ position: 'absolute', top: 16, right: 16, padding: '8px 16px', fontSize: 14 }} onClick={() => setShowDeposit(true)}>
            Deposit Funds
          </button>
              {/* Deposit Modal */}
              {showDeposit && (
                <div
                  style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.55)', zIndex: 2000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onClick={handleOverlayClick}
                  aria-modal="true"
                  role="dialog"
                >
                  <div
                    ref={modalContentRef}
                    className="glass-panel animate-slide-up"
                    style={{ minWidth: 340, padding: 36, position: 'relative', boxShadow: '0 8px 32px rgba(0,0,0,0.25)', borderRadius: 16 }}
                  >
                    <button
                      onClick={() => setShowDeposit(false)}
                      style={{
                        position: 'absolute', top: 10, right: 10, background: '#fff', border: '1px solid #eee', borderRadius: '50%', width: 36, height: 36,
                        fontSize: 22, cursor: 'pointer', color: '#333', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
                      }}
                      aria-label="Close deposit modal"
                      tabIndex={0}
                    >&times;</button>
                    <h2 className="text-xl" style={{ marginBottom: 16 }}>Deposit Funds</h2>
                    <form onSubmit={handleDeposit}>
                      <div className="input-group">
                        <label>Amount ($)</label>
                        <input type="number" className="input-field" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} min="1" required />
                      </div>
                      {depositError && <div className="badge badge-danger" style={{ margin: '12px 0' }}>{depositError}</div>}
                      {depositSuccess && <div className="badge badge-success" style={{ margin: '12px 0' }}>{depositSuccess}</div>}
                      <button type="submit" className="btn btn-success" style={{ width: '100%', marginTop: 12, padding: 12 }}>Deposit</button>
                    </form>
                  </div>
                </div>
              )}
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-secondary)' }}>
              <Briefcase size={24} />
            </div>
            <h3 className="text-muted">Portfolio Value</h3>
          </div>
          <div className="text-3xl" style={{ fontWeight: 800 }}>${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--accent-success)' }}>
              <TrendingUp size={24} />
            </div>
            <h3 className="text-muted">Buying Power</h3>
          </div>
          <div className="text-3xl" style={{ fontWeight: 800 }}>${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '24px' }}>
        <h2 className="text-xl" style={{ marginBottom: '20px' }}>Your Assets</h2>
        {portfolio.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No assets yet. Go to Trade to buy some stocks.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Symbol</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Shares</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Avg Price</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Current Price</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Total Value</th>
                <th style={{ padding: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Return</th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map(holding => {
                const stock = stocks.find(s => s.symbol === holding.symbol);
                const currentPrice = stock ? stock.price : holding.avgPrice;
                const value = holding.shares * currentPrice;
                const totalCost = holding.shares * holding.avgPrice;
                const ret = ((value - totalCost) / totalCost) * 100;
                
                return (
                  <tr key={holding.symbol} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                    <td style={{ padding: '16px', fontWeight: 600 }}>{holding.symbol}</td>
                    <td style={{ padding: '16px' }}>{holding.shares}</td>
                    <td style={{ padding: '16px' }}>${holding.avgPrice.toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>${currentPrice.toFixed(2)}</td>
                    <td style={{ padding: '16px' }}>${value.toFixed(2)}</td>
                    <td style={{ padding: '16px', color: ret >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                      <div className="flex items-center gap-1">
                        {ret >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {Math.abs(ret).toFixed(2)}%
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      {/* Transaction History Section */}
      <div className="glass-panel" style={{ padding: '24px', marginTop: '32px' }}>
        <h2 className="text-xl" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Clock size={20} /> Transaction History
        </h2>
        {transactions && transactions.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Type</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Details</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Amount</th>
                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{tx.type}</td>
                  <td style={{ padding: '12px' }}>{tx.details}</td>
                  <td style={{ padding: '12px', color: tx.amount < 0 ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
                    {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td style={{ padding: '12px', fontSize: 13 }}>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No transactions yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
