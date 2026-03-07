import React from 'react';

export default function Loader({ size = 48, text = '' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', gap: 16 }}>
      <div style={{ width: size, height: size, border: `3px solid #f0ebe3`, borderTopColor: '#CFA052', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
      {text && <div style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>{text}</div>}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
