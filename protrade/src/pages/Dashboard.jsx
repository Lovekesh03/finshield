import React from 'react';
import { useTrading } from '../context/TradingContext';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';

const Dashboard = () => {
  const { balance, portfolio, stocks } = useTrading();

  const totalPortfolioValue = portfolio.reduce((acc, holding) => {
    const currentPrice = stocks.find(s => s.symbol === holding.symbol)?.price || holding.avgPrice;
    return acc + (holding.shares * currentPrice);
  }, 0);

  const totalNetWorth = balance + totalPortfolioValue;

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl">Portfolio Dashboard</h1>
        <p className="text-muted">Welcome to your ProTrade dashboard.</p>
      </header>

      <div className="grid-3" style={{ marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="flex items-center gap-3" style={{ marginBottom: '16px' }}>
            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
              <DollarSign size={24} />
            </div>
            <h3 className="text-muted">Total Net Worth</h3>
          </div>
          <div className="text-3xl" style={{ fontWeight: 800 }}>${totalNetWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
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
    </div>
  );
};

export default Dashboard;
