import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../slices/authSlice';
import { toast } from 'react-toastify';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import GoogleIcon from '@mui/icons-material/Google';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => { if (user) navigate('/'); }, [user, navigate]);
  useEffect(() => { if (error) toast.error(error); }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('Fill all fields'); return; }
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    dispatch(registerUser({ name: form.name, email: form.email, password: form.password }));
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', ph: 'Manish Kumar', Icon: PersonOutlineIcon },
    { key: 'email', label: 'Email Address', type: 'email', ph: 'you@example.com', Icon: EmailOutlinedIcon },
    { key: 'password', label: 'Password', type: showPwd ? 'text' : 'password', ph: '••••••••', Icon: LockOutlinedIcon },
    { key: 'confirm', label: 'Confirm Password', type: showPwd ? 'text' : 'password', ph: '••••••••', Icon: LockOutlinedIcon },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#f7f2ec] to-[#ede5d8] px-4 py-10">
      <div className="w-full max-w-[460px] bg-white rounded-3xl px-8 py-10 md:p-11 shadow-[0_20px_64px_rgba(0,0,0,0.10)]">

        <div className="text-center mb-8">
          <DiamondOutlinedIcon sx={{ fontSize: 30, color: '#CFA052', marginBottom: '10px' }} />
          <h1 className="font-playfair text-[1.9rem] font-bold text-charcoal mb-1.5">Create Account</h1>
          <p className="text-[0.88rem] text-gray-400">Join the Aurelia Luxe members club</p>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map(({ key, label, type, ph, Icon }) => (
            <div key={key} className="mb-4 relative">
              <label className="block text-[0.72rem] font-bold text-gray-500 mb-2 tracking-[1px] uppercase">{label}</label>
              <Icon sx={{ position: 'absolute', left: 12, bottom: 12, fontSize: 18, color: '#9CA3AF' }} />
              <input
                type={type} placeholder={ph} value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full py-3 pl-11 pr-11 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.92rem] bg-cream text-charcoal outline-none transition-colors focus:border-gold"
              />
              {key === 'password' && (
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 bottom-3 bg-transparent border-none cursor-pointer">
                  {showPwd ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />}
                </button>
              )}
            </div>
          ))}

          <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 text-[0.95rem] mt-2 mb-4">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-[1px] bg-[#f0ebe3]" />
          <span className="text-[0.75rem] text-gray-400 font-semibold">OR</span>
          <div className="flex-1 h-[1px] bg-[#f0ebe3]" />
        </div>

        <button
          onClick={() => window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`}
          className="w-full py-3.5 border-[1.5px] border-[#e8e0d6] rounded-xl bg-white font-inter text-[0.9rem] font-semibold cursor-pointer flex items-center justify-center gap-2 text-charcoal transition-colors hover:border-gold">
          <GoogleIcon sx={{ fontSize: 18, color: '#EA4335' }} /> Continue with Google
        </button>

        <p className="text-center mt-6 text-[0.85rem] text-gray-400">
          Already a member?{' '}
          <Link to="/login" className="text-gold font-bold">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
