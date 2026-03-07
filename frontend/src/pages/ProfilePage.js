import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector(s => s.auth);
  const { items: wishItems } = useSelector(s => s.wishlist);
  const { items: cartItems } = useSelector(s => s.cart);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', password: '', confirm: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password && form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    const payload = { name: form.name, email: form.email };
    if (form.password) payload.password = form.password;
    const r = await dispatch(updateProfile(payload));
    if (!r.error) toast.success('Profile updated ✨');
    else toast.error(r.payload || 'Update failed');
  };

  return (
    <div className="bg-cream min-h-[80vh] py-8 md:py-10 px-4 md:px-12">
      <div className="max-w-[800px] mx-auto">
        <h1 className="font-playfair text-2xl md:text-[2rem] font-bold mb-8 text-charcoal">My Profile</h1>

        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_280px] gap-6">

          {/* FORM */}
          <div className="bg-white rounded-2xl p-6 md:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-[72px] md:h-[72px] rounded-full bg-gradient-to-br from-gold to-[#E8C97A] flex items-center justify-center mb-6">
              <span className="font-playfair text-[1.6rem] md:text-[1.8rem] font-bold text-white">{user?.name?.[0]?.toUpperCase()}</span>
            </div>
            <div className="font-playfair text-[1.2rem] font-bold mb-0.5 text-charcoal">{user?.name}</div>
            <div className="text-[0.82rem] text-gray-400 mb-6">{user?.role === 'admin' ? '⚙️ Admin' : 'Member'}</div>

            <form onSubmit={handleSubmit}>
              {[
                { key: 'name', label: 'Full Name', type: 'text', ph: 'Manish Kumar', Icon: PersonOutlineIcon },
                { key: 'email', label: 'Email Address', type: 'email', ph: 'you@example.com', Icon: EmailOutlinedIcon },
                { key: 'password', label: 'New Password', type: 'password', ph: 'Leave blank to keep current', Icon: LockOutlinedIcon },
                { key: 'confirm', label: 'Confirm Password', type: 'password', ph: '••••••••', Icon: LockOutlinedIcon },
              ].map(({ key, label, type, ph, Icon }) => (
                <div key={key} className="mb-4 relative">
                  <label className="block text-[0.72rem] font-bold text-gray-500 mb-1.5 tracking-[1px] uppercase">{label}</label>
                  <Icon sx={{ position: 'absolute', left: 12, bottom: 11, fontSize: 18, color: '#9CA3AF' }} />
                  <input
                    type={type} placeholder={ph} value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full py-2.5 pl-11 pr-3.5 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.9rem] bg-cream text-charcoal outline-none transition-colors focus:border-gold"
                  />
                </div>
              ))}
              <button type="submit" disabled={loading} className="btn-gold w-full py-3.5 mt-2">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* SIDEBAR STATS */}
          <div className="flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {[
              { Icon: ShoppingBagOutlinedIcon, label: 'Items in Cart', value: cartItems.length, action: () => navigate('/cart'), actionLabel: 'View Cart' },
              { Icon: FavoriteBorderIcon, label: 'Wishlist Items', value: wishItems.length, action: () => navigate('/wishlist'), actionLabel: 'View Wishlist' },
              { Icon: DiamondOutlinedIcon, label: 'Membership', value: user?.role === 'admin' ? 'Admin' : 'Gold Member', action: null },
            ].map(({ Icon, label, value, action, actionLabel }) => (
              <div key={label} className="bg-white rounded-2xl px-5 py-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gold/5 min-w-[160px] lg:min-w-0">
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-[#fef9ec] flex items-center justify-center shrink-0">
                    <Icon sx={{ fontSize: 18, color: '#CFA052' }} />
                  </div>
                  <span className="text-[0.78rem] text-gray-400 font-semibold">{label}</span>
                </div>
                <div className="font-playfair text-[1.4rem] font-bold text-charcoal mb-2">{value}</div>
                {action && (
                  <button onClick={action} className="bg-transparent border-none text-[0.8rem] text-gold font-bold cursor-pointer p-0 hover:underline">
                    {actionLabel} →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
