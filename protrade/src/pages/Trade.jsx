import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';

const Trade = () => {
  const { stocks, buyStock, sellStock, balance, portfolio } = useTrading();
  const [selectedStock, setSelectedStock] = useState(stocks[0]);
  const [shares, setShares] = useState('');
  const [action, setAction] = useState('buy'); // 'buy' or 'sell'
  const [error, setError] = useState('');

  const handleStockClick = (stock) => {
    setSelectedStock(stock);
    setError('');
    setShares('');
  };

  const currentHolding = portfolio.find(p => p.symbol === selectedStock.symbol)?.shares || 0;

  const handleTrade = (e) => {
    e.preventDefault();
    const parsedShares = parseInt(shares);
    if (!parsedShares || parsedShares <= 0) {
      setError('Please enter a valid number of shares.');
      return;
    }

    if (action === 'buy') {
      const res = buyStock(selectedStock.symbol, parsedShares, selectedStock.price);
      if (!res.success) setError(res.error);
      else { setShares(''); setError(''); }
    } else {
      const res = sellStock(selectedStock.symbol, parsedShares, selectedStock.price);
      if (!res.success) setError(res.error);
      else { setShares(''); setError(''); }
    }
  };

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl">Trade Stocks</h1>
        <p className="text-muted">Simulated trading with real-time mockup data.</p>
      </header>

      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h2 className="text-xl" style={{ marginBottom: '20px' }}>Market Watch</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {stocks.map(stock => (
              <div 
                key={stock.symbol} 
                onClick={() => handleStockClick(stock)}
                className="glass-card flex justify-between items-center" 
                style={{ cursor: 'pointer', border: selectedStock.symbol === stock.symbol ? '1px solid var(--accent-primary)' : '1px solid transparent' }}
              >
                <div>
                  <div className="text-xl">{stock.symbol}</div>
                  <div className="text-sm text-muted">{stock.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="text-xl">${stock.price.toFixed(2)}</div>
                  <div className={`text-sm ${stock.change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px', alignSelf: 'start' }}>
          <h2 className="text-xl" style={{ marginBottom: '20px' }}>Order Ticket</h2>
          
          <div className="flex gap-4" style={{ marginBottom: '24px' }}>
            <button 
              className={`btn ${action === 'buy' ? 'btn-primary' : 'btn-outline'}`} 
              style={{ flex: 1 }} 
              onClick={() => { setAction('buy'); setError(''); }}
            >
              Buy
            </button>
            <button 
              className={`btn ${action === 'sell' ? 'btn-danger' : 'btn-outline'}`} 
              style={{ flex: 1 }} 
              onClick={() => { setAction('sell'); setError(''); }}
            >
              Sell
            </button>
          </div>

          <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
            <div className="flex justify-between" style={{ marginBottom: '8px' }}>
              <span className="text-muted">Selected</span>
              <span className="text-xl">{selectedStock.symbol}</span>
            </div>
            <div className="flex justify-between" style={{ marginBottom: '8px' }}>
              <span className="text-muted">Current Price</span>
              <span>${selectedStock.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '8px', marginTop: '8px' }}>
              <span className="text-muted">{action === 'buy' ? 'Buying Power' : 'Shares Owned'}</span>
              <span>{action === 'buy' ? `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : currentHolding}</span>
            </div>
          </div>

          {error && <div className="badge badge-danger" style={{ marginBottom: '16px', display: 'block', textAlign: 'center', padding: '8px' }}>{error}</div>}

          <form onSubmit={handleTrade}>
            <div className="input-group">
              <label>Number of Shares</label>
              <input type="number" min="1" className="input-field" value={shares} onChange={e => setShares(e.target.value)} required />
            </div>
            
            <div className="flex justify-between text-xl" style={{ margin: '24px 0', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
              <span>Estimated {action === 'buy' ? 'Cost' : 'Credit'}</span>
              <span>${((parseFloat(shares) || 0) * selectedStock.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

            <button type="submit" className={`btn ${action === 'buy' ? 'btn-primary' : 'btn-danger'}`} style={{ width: '100%', padding: '16px' }}>
              Submit Order
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Trade;
