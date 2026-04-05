import React, { useState } from 'react';
import { useTrading } from '../context/TradingContext';
import FraudAlert from '../components/FraudAlert';
import { ShieldCheck, Send } from 'lucide-react';
import { fraudSignalCheck } from '../utils/fraudEngine';

const Transfer = () => {
  const { transferFunds } = useTrading();
  const [formData, setFormData] = useState({
    accountName: '',
    accountNumber: '',
    routingNumber: '',
    amount: ''
  });
  
  const [alertConfig, setAlertConfig] = useState(null); // { type, title, message }

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  // Remove checkRisk, use fraudSignalCheck instead


  const handleTransfer = async (e) => {
    e.preventDefault();
    // Call fraud engine before transfer
    const fraudResult = await fraudSignalCheck(formData);
    let alertType = 'nudge', alertTitle = '', alertMessage = '';
    if (fraudResult.action === 'Block') {
      alertType = 'block';
      alertTitle = 'Transaction Blocked';
      alertMessage = `Fraud Signal Score: ${fraudResult.riskScore}/100. This transfer is blocked due to high risk.\n\nDetails: ${fraudResult.details.map(d => d.name + ': ' + d.score).join(', ')}`;
    } else if (fraudResult.action === 'Pause') {
      alertType = 'pause';
      alertTitle = 'Suspicious Activity Detected';
      alertMessage = `Fraud Signal Score: ${fraudResult.riskScore}/100. Please review this transfer.\n\nDetails: ${fraudResult.details.map(d => d.name + ': ' + d.score).join(', ')}`;
    } else if (fraudResult.action === 'Nudge') {
      alertType = 'nudge';
      alertTitle = 'Caution: Potential Risk';
      alertMessage = `Fraud Signal Score: ${fraudResult.riskScore}/100. Please double check the recipient details.\n\nDetails: ${fraudResult.details.map(d => d.name + ': ' + d.score).join(', ')}`;
    }
    if (fraudResult.action !== 'Pass') {
      setAlertConfig({ type: alertType, title: alertTitle, message: alertMessage });
    } else {
      executeTransfer();
    }
  };

  const executeTransfer = () => {
    setAlertConfig(null);
    // Record transaction in context
    transferFunds(
      parseFloat(formData.amount),
      formData.accountNumber,
      {
        recipient: formData.accountName,
        routingNumber: formData.routingNumber,
        note: 'Wire transfer from Transfer page'
      }
    );
    alert('Transfer executed successfully!');
    setFormData({ accountName: '', accountNumber: '', routingNumber: '', amount: '' });
  };

  return (
    <div className="animate-slide-up">
      <header style={{ marginBottom: '32px' }}>
        <h1 className="text-3xl">Transfer Funds</h1>
        <p className="text-muted">Move money in and out of your ProTrade account.</p>
        <div className="badge badge-success text-sm flex items-center gap-1" style={{ display: 'inline-flex', marginTop: '8px' }}>
          <ShieldCheck size={14} /> FinGuard Active Protection
        </div>
      </header>

      {alertConfig && (
        <FraudAlert 
          type={alertConfig.type} 
          title={alertConfig.title} 
          message={alertConfig.message} 
          onProceed={executeTransfer} 
          onCancel={() => setAlertConfig(null)} 
        />
      )}

      <div className="glass-panel" style={{ maxWidth: '600px', padding: '32px' }}>
        <h2 className="text-xl" style={{ marginBottom: '24px' }}>Wire Transfer Details</h2>
        <form onSubmit={handleTransfer}>
          <div className="input-group">
            <label>Recipient Name</label>
            <input type="text" name="accountName" className="input-field" value={formData.accountName} onChange={handleChange} required />
          </div>
          
          <div className="grid-2" style={{ marginBottom: 0 }}>
            <div className="input-group">
              <label>Account Number</label>
              <input type="text" name="accountNumber" className="input-field" value={formData.accountNumber} onChange={handleChange} required />
              <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Try '1234' for Fraud alert.</div>
            </div>
            <div className="input-group">
              <label>Routing Number</label>
              <input type="text" name="routingNumber" className="input-field" value={formData.routingNumber} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="input-group">
            <label>Amount ($)</label>
            <input type="number" name="amount" className="input-field" value={formData.amount} onChange={handleChange} required />
            <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Try &gt; $10,000 for Nudge, &gt; $100,000 for Block.</div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '16px' }}>
            <Send size={20} /> Initiate Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;
