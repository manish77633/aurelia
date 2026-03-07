import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/auth/forgot-password`, { email });
      setSent(true);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed. Try again.'); }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#f7f2ec] to-[#ede5d8] px-4 py-10">
      <div className="w-full max-w-[420px] bg-white rounded-3xl px-8 py-10 md:p-11 shadow-[0_20px_64px_rgba(0,0,0,0.10)] text-center">
        {!sent ? (
          <>
            <DiamondOutlinedIcon sx={{ fontSize: 30, color: '#CFA052', marginBottom: '12px' }} />
            <h1 className="font-playfair text-[1.7rem] font-bold mb-2 text-charcoal">Forgot Password?</h1>
            <p className="text-[0.88rem] text-gray-400 mb-7 leading-relaxed">Enter your registered email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit}>
              <div className="relative mb-5 text-left">
                <label className="block text-[0.72rem] font-bold text-gray-500 mb-2 tracking-[1px] uppercase">Email Address</label>
                <EmailOutlinedIcon sx={{ position: 'absolute', left: 12, bottom: 12, fontSize: 18, color: '#9CA3AF' }} />
                <input
                  type="email" placeholder="you@example.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full py-3 pl-11 pr-3.5 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.9rem] bg-cream outline-none transition-colors focus:border-gold"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mb-4">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <Link to="/login" className="text-[0.85rem] text-gold font-semibold">← Back to Login</Link>
          </>
        ) : (
          <>
            <CheckCircleOutlineIcon sx={{ fontSize: 52, color: '#10b981', marginBottom: '16px' }} />
            <h2 className="font-playfair text-[1.5rem] font-bold mb-3 text-charcoal">Email Sent!</h2>
            <p className="text-[0.88rem] text-gray-500 mb-6 leading-relaxed">
              We've sent a password reset link to <strong>{email}</strong>. Check your inbox (and spam folder).
            </p>
            <Link to="/login" className="inline-flex px-7 py-2.5 bg-gold text-white rounded-xl font-bold text-[0.88rem] hover:bg-gold-dark transition-colors">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
