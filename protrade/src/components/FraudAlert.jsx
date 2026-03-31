import React from 'react';
import { AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

const FraudAlert = ({ type, title, message, onProceed, onCancel }) => {
  
  // type: 'nudge', 'pause', 'block'
  
  const getIcon = () => {
    switch (type) {
      case 'block': return <XCircle size={48} className="text-danger" />;
      case 'pause': return <ShieldAlert size={48} className="text-warning" style={{ color: 'var(--accent-warning)' }} />;
      default: return <AlertTriangle size={48} className="text-warning" style={{ color: 'var(--accent-warning)' }} />;
    }
  };

  const getCardClass = () => {
    if (type === 'block') return 'glass-panel animate-pulse-danger';
    return 'glass-panel animate-slide-up';
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className={getCardClass()} style={{ maxWidth: '450px', width: '100%', padding: '32px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          {getIcon()}
        </div>
        <h2 className="text-2xl" style={{ marginBottom: '16px' }}>{title}</h2>
        <p className="text-muted" style={{ marginBottom: '32px', lineHeight: 1.6 }}>{message}</p>
        
        <div className="flex gap-4 justify-center">
          <button className="btn btn-outline" onClick={onCancel} style={{ flex: 1 }}>
            {type === 'block' ? 'Close' : 'Cancel Transaction'}
          </button>
          
          {type !== 'block' && (
            <button className={type === 'pause' ? 'btn btn-outline' : 'btn btn-danger'} onClick={onProceed} style={{ flex: 1, ...(type === 'pause' ? { borderColor: 'var(--accent-warning)', color: 'var(--accent-warning)' } : {}) }}>
              {type === 'pause' ? 'Proceed Anyway' : 'I Understand'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FraudAlert;
