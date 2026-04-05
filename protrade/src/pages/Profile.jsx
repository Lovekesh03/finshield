import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrading } from '../context/TradingContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { balance, portfolio } = useTrading();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });


  const handleSave = e => {
    e.preventDefault();
    updateProfile(form);
    setSuccess('Profile updated!');
    setEditMode(false);
    setTimeout(() => setSuccess(''), 1500);
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: 480, margin: '40px auto' }}>
      <h1 className="text-3xl" style={{ marginBottom: 24 }}>User Profile</h1>
      <div className="glass-panel" style={{ padding: 32 }}>
        <form onSubmit={handleSave}>
          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" className="input-field" value={form.name} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" className="input-field" value={form.email} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="input-group">
            <label>Account Balance</label>
            <input type="text" className="input-field" value={`$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} disabled />
          </div>
          <div className="input-group">
            <label>Assets Owned</label>
            <input type="text" className="input-field" value={portfolio.length} disabled />
          </div>
          {success && <div className="badge badge-success" style={{ margin: '12px 0' }}>{success}</div>}
          <div style={{ marginTop: 24 }}>
            {editMode ? (
              <>
                <button type="submit" className="btn btn-primary" style={{ marginRight: 12 }}>Save</button>
                <button type="button" className="btn btn-outline" onClick={() => setEditMode(false)}>Cancel</button>
              </>
            ) : (
              <button type="button" className="btn btn-outline" onClick={() => setEditMode(true)}>Edit Profile</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
