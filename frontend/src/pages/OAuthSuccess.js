import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const name = params.get('name');
    const email = params.get('email');
    const role = params.get('role');
    if (token) {
      dispatch(setCredentials({ token, name, email, role }));
      navigate('/');
    } else { navigate('/login'); }
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.2rem', fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>Authenticating...</div>
        <div style={{ width: 36, height: 36, border: '3px solid #e8e0d6', borderTopColor: '#CFA052', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
