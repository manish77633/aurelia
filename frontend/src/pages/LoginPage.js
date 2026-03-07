import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../slices/authSlice';
import { toast } from 'react-toastify';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import GoogleIcon from '@mui/icons-material/Google';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Fill all fields'); return; }
    dispatch(loginUser(form));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#f7f2ec] to-[#ede5d8] px-4 py-10">
      <div className="w-full max-w-[460px] bg-white rounded-3xl px-8 py-10 md:p-11 shadow-[0_20px_64px_rgba(0,0,0,0.10)]">

        {/* Header */}
        <div className="text-center mb-8">
          <DiamondOutlinedIcon sx={{ fontSize: 30, color: '#CFA052', marginBottom: '10px' }} />
          <h1 className="font-playfair text-[1.9rem] font-bold text-charcoal mb-1.5">Welcome Back</h1>
          <p className="text-[0.88rem] text-gray-400">Sign in to your Aurelia Luxe account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-5 relative">
            <label className="block text-[0.72rem] font-bold text-gray-500 mb-2 tracking-[1px] uppercase">Email Address</label>
            <EmailOutlinedIcon sx={{ position: 'absolute', left: 12, bottom: 12, fontSize: 18, color: '#9CA3AF' }} />
            <input
              type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full py-3 pr-3.5 pl-11 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.92rem] bg-cream text-charcoal outline-none transition-colors focus:border-gold"
            />
          </div>

          {/* Password */}
          <div className="mb-3 relative">
            <label className="block text-[0.72rem] font-bold text-gray-500 mb-2 tracking-[1px] uppercase">Password</label>
            <LockOutlinedIcon sx={{ position: 'absolute', left: 12, bottom: 12, fontSize: 18, color: '#9CA3AF' }} />
            <input
              type={showPwd ? 'text' : 'password'} placeholder="••••••••" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full py-3 pl-11 pr-11 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.92rem] bg-cream text-charcoal outline-none transition-colors focus:border-gold"
            />
            <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 bottom-3 bg-transparent border-none cursor-pointer">
              {showPwd ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />}
            </button>
          </div>

          <div className="text-right mb-6">
            <Link to="/forgot-password" className="text-[0.8rem] text-gold font-semibold">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-[0.95rem] mb-4">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-[1px] bg-[#f0ebe3]" />
          <span className="text-[0.75rem] text-gray-400 font-semibold">OR</span>
          <div className="flex-1 h-[1px] bg-[#f0ebe3]" />
        </div>

        {/* Google OAuth */}
        <button
          onClick={() => window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`}
          className="w-full py-3.5 border-[1.5px] border-[#e8e0d6] rounded-xl bg-white font-inter text-[0.9rem] font-semibold cursor-pointer flex items-center justify-center gap-2 text-charcoal transition-colors hover:border-gold">
          <GoogleIcon sx={{ fontSize: 18, color: '#EA4335' }} /> Continue with Google
        </button>

        <p className="text-center mt-6 text-[0.85rem] text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold font-bold">Create one</Link>
        </p>
      </div>
    </div>
  );
}
