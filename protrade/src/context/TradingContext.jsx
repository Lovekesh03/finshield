import React, { createContext, useState, useEffect, useContext } from 'react';

const TradingContext = createContext();

export const useTrading = () => useContext(TradingContext);


export const TradingProvider = ({ children }) => {
  const [balance, setBalance] = useState(25000.00);
  const [portfolio, setPortfolio] = useState([
    { symbol: 'AAPL', shares: 50, avgPrice: 150.0 },
    { symbol: 'MSFT', shares: 20, avgPrice: 310.5 },
    { symbol: 'TSLA', shares: 15, avgPrice: 180.2 }
  ]);
  const [stocks, setStocks] = useState([
    { symbol: 'AAPL', name: 'Apple Inc.', price: 173.50, change: 1.2 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 338.11, change: -0.5 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 205.85, change: 2.4 },
    { symbol: 'AMZN', name: 'Amazon.com', price: 128.90, change: 0.8 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 450.20, change: 3.5 }
  ]);
  // Transaction history: { type, details, amount, date, meta }
  const [transactions, setTransactions] = useState([]);
  // Notifications: { type, message, date }
  const [notifications, setNotifications] = useState([]);
  // Deposit funds
  const depositFunds = (amount) => {
    if (amount > 0) {
      setBalance(prev => prev + amount);
      setTransactions(prev => [
        {
          type: 'Deposit',
          details: `Deposit to account`,
          amount: amount,
          date: new Date().toLocaleString(),
          meta: {}
        },
        ...prev
      ]);
      setNotifications(prev => [
        { type: 'success', message: `Deposited $${amount.toLocaleString()}`, date: new Date().toLocaleString() },
        ...prev
      ]);
      return { success: true };
    }
    return { success: false, error: 'Invalid deposit amount' };
  };

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const volatility = stock.price * 0.002;
        const change = (Math.random() * volatility * 2) - volatility;
        return {
          ...stock,
          price: stock.price + change,
          change: ((stock.price + change - (stock.price - stock.price * (stock.change/100))) / (stock.price - stock.price * (stock.change/100))) * 100
        };
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  const buyStock = (symbol, shares, currentPrice) => {
    const cost = shares * currentPrice;
    if (balance >= cost) {
      setBalance(prev => prev - cost);
      setPortfolio(prev => {
        const existing = prev.find(p => p.symbol === symbol);
        if (existing) {
          const totalCost = (existing.shares * existing.avgPrice) + (shares * currentPrice);
          const totalShares = existing.shares + shares;
          return prev.map(p => p.symbol === symbol ? { ...p, shares: totalShares, avgPrice: totalCost / totalShares } : p);
        }
        return [...prev, { symbol, shares, avgPrice: currentPrice }];
      });
      setTransactions(prev => [
        {
          type: 'Buy',
          details: `${shares} shares of ${symbol} @ $${currentPrice.toFixed(2)}`,
          amount: -cost,
          date: new Date().toLocaleString(),
          meta: { symbol, shares, price: currentPrice }
        },
        ...prev
      ]);
      if (cost > 10000) {
        setNotifications(prev => [
          { type: 'warning', message: `Large trade: Bought $${cost.toLocaleString()} of ${symbol}`, date: new Date().toLocaleString() },
          ...prev
        ]);
      }
      if (balance - cost < 1000) {
        setNotifications(prev => [
          { type: 'danger', message: `Low balance: $${(balance - cost).toLocaleString()}`, date: new Date().toLocaleString() },
          ...prev
        ]);
      }
      return { success: true };
    }
    setNotifications(prev => [
      { type: 'danger', message: `Trade failed: Insufficient funds`, date: new Date().toLocaleString() },
      ...prev
    ]);
    return { success: false, error: 'Insufficient funds' };
  };


  const sellStock = (symbol, shares, currentPrice) => {
    const holding = portfolio.find(p => p.symbol === symbol);
    if (holding && holding.shares >= shares) {
      const revenue = shares * currentPrice;
      setBalance(prev => prev + revenue);
      setPortfolio(prev => {
        if (holding.shares === shares) {
          return prev.filter(p => p.symbol !== symbol);
        }
        return prev.map(p => p.symbol === symbol ? { ...p, shares: p.shares - shares } : p);
      });
      setTransactions(prev => [
        {
          type: 'Sell',
          details: `${shares} shares of ${symbol} @ $${currentPrice.toFixed(2)}`,
          amount: revenue,
          date: new Date().toLocaleString(),
          meta: { symbol, shares, price: currentPrice }
        },
        ...prev
      ]);
      if (revenue > 10000) {
        setNotifications(prev => [
          { type: 'warning', message: `Large trade: Sold $${revenue.toLocaleString()} of ${symbol}`, date: new Date().toLocaleString() },
          ...prev
        ]);
      }
      if (balance + revenue < 1000) {
        setNotifications(prev => [
          { type: 'danger', message: `Low balance: $${(balance + revenue).toLocaleString()}`, date: new Date().toLocaleString() },
          ...prev
        ]);
      }
      return { success: true };
    }
    setNotifications(prev => [
      { type: 'danger', message: `Trade failed: Insufficient shares`, date: new Date().toLocaleString() },
      ...prev
    ]);
    return { success: false, error: 'Insufficient shares' };
  };


  const transferFunds = (amount, toAccount, meta = {}) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      setTransactions(prev => [
        {
          type: 'Transfer',
          details: `Transfer to ${toAccount}`,
          amount: -amount,
          date: new Date().toLocaleString(),
          meta
        },
        ...prev
      ]);
      if (amount > 10000) {
        setNotifications(prev => [
          { type: 'warning', message: `Large transfer: $${amount.toLocaleString()} to ${toAccount}`, date: new Date().toLocaleString() },
          ...prev
        ]);
      }
      if (balance - amount < 1000) {
        setNotifications(prev => [
          { type: 'danger', message: `Low balance: $${(balance - amount).toLocaleString()}`, date: new Date().toLocaleString() },
          ...prev
        ]);
      }
      return { success: true };
    }
    setNotifications(prev => [
      { type: 'danger', message: `Transfer failed: Insufficient funds`, date: new Date().toLocaleString() },
      ...prev
    ]);
    return { success: false, error: 'Insufficient funds' };
  };

  return (
    <TradingContext.Provider value={{ balance, portfolio, stocks, buyStock, sellStock, transferFunds, depositFunds, transactions, notifications }}>
      {children}
    </TradingContext.Provider>
  );
};
