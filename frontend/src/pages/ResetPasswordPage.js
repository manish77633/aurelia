import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/auth/reset-password/${token}`, { password });
      toast.success('Password reset! Please log in.');
      navigate('/login');
    } catch (err) { toast.error(err.response?.data?.message || 'Reset failed'); }
    setLoading(false);
  };

  const inp = { width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid #e8e0d6', borderRadius: 10, fontFamily: "'Inter',sans-serif", fontSize: '0.9rem', background: '#FAFAFA', outline: 'none' };

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#f7f2ec,#ede5d8)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24, padding: '44px 40px', boxShadow: '0 20px 64px rgba(0,0,0,0.10)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <DiamondOutlinedIcon sx={{ fontSize: 30, color: '#CFA052', marginBottom: '12px' }} />
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.7rem', fontWeight: 700 }}>Set New Password</h1>
          <p style={{ fontSize: '0.88rem', color: '#9CA3AF', marginTop: 6 }}>Choose a strong password for your account.</p>
        </div>
        <form onSubmit={handleSubmit}>
          {[{ val: password, fn: setPassword, label: 'New Password', ph: '••••••••' }, { val: confirm, fn: setConfirm, label: 'Confirm Password', ph: '••••••••' }].map(({ val, fn, label, ph }) => (
            <div key={label} style={{ marginBottom: 18, position: 'relative' }}>
              <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', display: 'block', marginBottom: 7, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</label>
              <LockOutlinedIcon sx={{ position: 'absolute', left: 12, bottom: 12, fontSize: 18, color: '#9CA3AF' }} />
              <input type="password" placeholder={ph} value={val} onChange={e => fn(e.target.value)} style={inp}
                onFocus={e => e.target.style.borderColor = '#CFA052'} onBlur={e => e.target.style.borderColor = '#e8e0d6'} />
            </div>
          ))}
          <button type="submit" disabled={loading} className="btn-gold" style={{ width: '100%', padding: '13px', marginTop: 8 }}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
