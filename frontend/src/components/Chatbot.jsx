import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = process.env.REACT_APP_API_URL;

// Unique session ID per browser tab
const SESSION_ID = `session_${Math.random().toString(36).slice(2)}`;

const WELCOME = {
	role: 'bot',
	text: "Hello! I'm Lumi ✨, your personal shopping assistant at Aurelia Luxe. Whether you're searching for a luxury watch, a designer bag, or exclusive apparel — I'm here to help! How can I assist you today?",
};

export default function Chatbot() {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([WELCOME]);
	const [input, setInput] = useState('');
	const [typing, setTyping] = useState(false);
	const [unread, setUnread] = useState(0);
	const bottomRef = useRef(null);
	const inputRef = useRef(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages, typing]);

	useEffect(() => {
		if (open) {
			setUnread(0);
			setTimeout(() => inputRef.current?.focus(), 100);
		}
	}, [open]);

	const sendMessage = async (overrideText) => {
		const textToSend = typeof overrideText === 'string' ? overrideText : input;
		const trimmed = textToSend.trim();
		if (!trimmed || typing) return;

		setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
		setInput('');
		setTyping(true);

		try {
			const { data } = await axios.post(`${API}/chat`, {
				message: trimmed,
				sessionId: SESSION_ID,
			});
			setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
			if (!open) setUnread(u => u + 1);
		} catch {
			setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again shortly! 🙏" }]);
		}

		setTyping(false);
	};

	const handleKey = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	const QUICK = ["What's trending?", 'Tell me about luxury watches', 'Return policy?', 'Shipping info'];

	const renderMessage = (text) => {
		const parts = text.split(/\[(.*?)\]\((.*?)\)/g);
		if (parts.length === 1) return text;

		const elements = [];
		for (let i = 0; i < parts.length; i += 3) {
			if (parts[i]) elements.push(<span key={`text-${i}`}>{parts[i]}</span>);
			if (i + 1 < parts.length) {
				const linkText = parts[i + 1];
				const url = parts[i + 2];
				const isProductLink = url.includes('/product/');
				const isInternal = url.startsWith('/') || url.includes(window.location.host);

				if (isInternal || isProductLink) {
					// Extract relative path if it's a full URL
					let internalPath = url;
					if (url.includes(window.location.host)) {
						internalPath = url.split(window.location.host)[1] || '/';
					} else if (isProductLink && !url.startsWith('/')) {
						internalPath = '/product/' + url.split('/product/')[1];
					}

					elements.push(
						<Link key={`link-${i}`} to={internalPath} style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 600 }}>
							{linkText}
						</Link>
					);
				} else {
					elements.push(
						<a key={`link-${i}`} href={url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 600 }}>
							{linkText}
						</a>
					);
				}
			}
		}
		return elements;
	};

	return (
		<>
			{/* ── Floating bubble ─────────────────────────── */}
			<button
				onClick={() => setOpen(o => !o)}
				aria-label="Open Lumi Chat"
				style={{
					position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
					width: 58, height: 58, borderRadius: '50%',
					background: 'linear-gradient(135deg, #CFA052, #E8C97A)',
					border: 'none', cursor: 'pointer',
					boxShadow: '0 8px 32px rgba(207,160,82,0.45)',
					display: 'flex', alignItems: 'center', justifyContent: 'center',
					transition: 'transform 0.2s, box-shadow 0.2s',
					transform: open ? 'scale(0.92)' : 'scale(1)',
				}}
				onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
				onMouseLeave={e => e.currentTarget.style.transform = open ? 'scale(0.92)' : 'scale(1)'}
			>
				{open ? (
					<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
				) : (
					<span style={{ fontSize: 26, lineHeight: 1 }}>✨</span>
				)}
				{/* Unread badge */}
				{!open && unread > 0 && (
					<span style={{
						position: 'absolute', top: -4, right: -4,
						background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700,
						width: 20, height: 20, borderRadius: '50%',
						display: 'flex', alignItems: 'center', justifyContent: 'center',
						border: '2px solid #fff',
					}}>{unread}</span>
				)}
			</button>

			{/* ── Chat Window ──────────────────────────────── */}
			<div
				style={{
					position: 'fixed', bottom: 94, right: 24, zIndex: 9998,
					width: 'min(370px, calc(100vw - 32px))',
					borderRadius: 20,
					background: '#fff',
					boxShadow: '0 24px 80px rgba(0,0,0,0.18)',
					border: '1px solid rgba(207,160,82,0.15)',
					display: 'flex', flexDirection: 'column',
					overflow: 'hidden',
					transition: 'opacity 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
					opacity: open ? 1 : 0,
					transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
					pointerEvents: open ? 'all' : 'none',
					maxHeight: 520,
				}}
			>
				{/* Header */}
				<div style={{ background: 'linear-gradient(135deg, #1A1A1A, #2d2620)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
					<div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #CFA052, #E8C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✨</div>
					<div style={{ flex: 1, minWidth: 0 }}>
						<div style={{ color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: "'Playfair Display', serif" }}>Lumi</div>
						<div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
							<span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', display: 'inline-block', flexShrink: 0 }} />
							Aurelia Shopping Assistant
						</div>
					</div>
					<button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex' }}>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
					</button>
				</div>

				{/* Messages */}
				<div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 6px', display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0, maxHeight: 330 }}>
					{messages.map((m, i) => (
						<div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 8, alignItems: 'flex-end' }}>
							{m.role === 'bot' && (
								<div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#CFA052,#E8C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0, marginBottom: 2 }}>✨</div>
							)}
							<div style={{
								maxWidth: '78%',
								padding: '9px 13px',
								borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
								background: m.role === 'user'
									? 'linear-gradient(135deg,#CFA052,#E8C97A)'
									: '#f5f0e8',
								color: m.role === 'user' ? '#fff' : '#1A1A1A',
								fontSize: 13,
								lineHeight: 1.55,
								fontFamily: 'Inter, sans-serif',
								wordBreak: 'break-word',
							}}>
								{renderMessage(m.text)}
							</div>
						</div>
					))}

					{/* Typing indicator */}
					{typing && (
						<div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
							<div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#CFA052,#E8C97A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>✨</div>
							<div style={{ background: '#f5f0e8', borderRadius: '16px 16px 16px 4px', padding: '10px 14px', display: 'flex', gap: 5, alignItems: 'center' }}>
								{[0, 0.2, 0.4].map((delay, i) => (
									<span key={i} style={{
										width: 7, height: 7, borderRadius: '50%', background: '#CFA052',
										display: 'inline-block',
										animation: 'typingBounce 1s ease-in-out infinite',
										animationDelay: `${delay}s`,
									}} />
								))}
							</div>
						</div>
					)}
					<div ref={bottomRef} />
				</div>

				{/* Quick replies */}
				{messages.length <= 1 && (
					<div style={{ padding: '4px 14px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
						{QUICK.map(q => (
							<button
								key={q}
								onClick={() => sendMessage(q)}
								style={{
									padding: '5px 11px', borderRadius: 999, fontSize: 11, fontWeight: 600,
									background: '#fef9ec', border: '1px solid rgba(207,160,82,0.3)',
									color: '#92400e', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
									transition: 'all 0.2s',
								}}
								onMouseEnter={e => { e.currentTarget.style.background = '#CFA052'; e.currentTarget.style.color = '#fff'; }}
								onMouseLeave={e => { e.currentTarget.style.background = '#fef9ec'; e.currentTarget.style.color = '#92400e'; }}
							>
								{q}
							</button>
						))}
					</div>
				)}

				{/* Input */}
				<div style={{ padding: '10px 12px', borderTop: '1px solid #f0ebe3', display: 'flex', gap: 8, alignItems: 'flex-end', background: '#fafafa' }}>
					<textarea
						ref={inputRef}
						value={input}
						onChange={e => setInput(e.target.value)}
						onKeyDown={handleKey}
						placeholder="Ask Lumi anything..."
						rows={1}
						style={{
							flex: 1, resize: 'none', border: '1.5px solid #e8e0d6',
							borderRadius: 12, padding: '9px 12px', fontSize: 13,
							fontFamily: 'Inter, sans-serif', color: '#1A1A1A',
							background: '#fff', outline: 'none',
							transition: 'border-color 0.2s',
							lineHeight: 1.5,
						}}
						onFocus={e => e.target.style.borderColor = '#CFA052'}
						onBlur={e => e.target.style.borderColor = '#e8e0d6'}
					/>
					<button
						onClick={sendMessage}
						disabled={!input.trim() || typing}
						style={{
							width: 38, height: 38, borderRadius: '50%', border: 'none', cursor: 'pointer',
							background: input.trim() && !typing
								? 'linear-gradient(135deg,#CFA052,#E8C97A)'
								: '#f0ebe3',
							boxShadow: input.trim() && !typing ? '0 4px 14px rgba(207,160,82,0.4)' : 'none',
							display: 'flex', alignItems: 'center', justifyContent: 'center',
							transition: 'all 0.2s', flexShrink: 0,
						}}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={input.trim() && !typing ? '#fff' : '#9CA3AF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
							<line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
						</svg>
					</button>
				</div>

				{/* Branding */}
				<div style={{ textAlign: 'center', fontSize: 10, color: '#9CA3AF', padding: '4px 0 8px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.5px' }}>
					Powered by Gemini AI · <span style={{ color: '#CFA052', fontWeight: 600 }}>Aurelia Luxe</span>
				</div>
			</div>

			{/* Typing animation keyframes */}
			<style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
		</>
	);
}
