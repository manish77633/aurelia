import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAdminVerified } from '../slices/authSlice';
import { toast } from 'react-toastify';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';

export default function AdminLoginPage() {
	const [password, setPassword] = useState('');
	const [email, setEmail] = useState('');
	const { user } = useSelector(s => s.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleAdminVerify = (e) => {
		e.preventDefault();
		// In a real app, you'd call a backend verify endpoint.
		// Here, for "quick" and "secure" feel, we verify against current user email 
		// and a specific admin master password or just the standard login flow.
		// User asked to "ask for id pas".
		if (email === user?.email && password === 'admin123456') {
			dispatch(setAdminVerified(true));
			toast.success('Admin Dashboard Access Granted');
			navigate('/admin');
		} else {
			toast.error('Invalid Credentials or Unauthorized Access');
		}
	};

	return (
		<div className="min-h-[90vh] flex items-center justify-center bg-[#FAFAFA] px-6">
			<div className="max-w-[450px] w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-[#CFA052]/10">
				<div className="text-center mb-10">
					<div className="w-16 h-16 bg-[#CFA052]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
						<LockOutlinedIcon sx={{ color: '#CFA052', fontSize: 32 }} />
					</div>
					<h1 className="font-playfair text-3xl font-bold text-charcoal mb-2">Restricted Access</h1>
					<p className="text-gray-500 text-sm">Please verify your admin credentials to continue</p>
				</div>

				<form onSubmit={handleAdminVerify} className="space-y-6">
					<div>
						<label className="block text-[0.7rem] font-bold tracking-[2px] text-gold uppercase mb-2 ml-1">Admin ID (Email)</label>
						<input
							type="email"
							required
							className="w-full py-3.5 px-5 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.9rem] outline-none focus:border-[#CFA052] transition-colors"
							placeholder="admin@aurelia.com"
							value={email}
							onChange={e => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<label className="block text-[0.7rem] font-bold tracking-[2px] text-gold uppercase mb-2 ml-1">Master Password</label>
						<input
							type="password"
							required
							className="w-full py-3.5 px-5 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.9rem] outline-none focus:border-[#CFA052] transition-colors"
							placeholder="••••••••"
							value={password}
							onChange={e => setPassword(e.target.value)}
						/>
					</div>
					<button
						type="submit"
						className="w-full py-4 bg-charcoal text-white rounded-xl font-bold uppercase tracking-[2px] text-[0.8rem] hover:bg-gold transition-all duration-300 shadow-lg shadow-charcoal/10"
					>
						Enter Dashboard
					</button>
				</form>

				<div className="mt-10 pt-8 border-t border-[#f0ebe3] flex items-center justify-center gap-2 grayscale brightness-150">
					<DiamondOutlinedIcon sx={{ fontSize: 16, color: '#CFA052' }} />
					<span className="text-[0.6rem] font-bold tracking-[3px] text-gold uppercase">Aurelia Systems</span>
				</div>
			</div>
		</div>
	);
}
