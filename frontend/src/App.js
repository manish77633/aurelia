import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import WishlistPage from './pages/WishlistPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AdminLoginPage from './pages/AdminLoginPage';
import OAuthSuccess from './pages/OAuthSuccess';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OrdersPage from './pages/OrdersPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import Chatbot from './components/Chatbot';
import PageTransition from './components/ui/PageTransition';

import { fetchCart } from './slices/cartSlice';
import { fetchWishlist } from './slices/wishlistSlice';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/login" replace />;
};
const AdminRoute = ({ children }) => {
  const { user, adminVerified } = useSelector((s) => s.auth);
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;
  return adminVerified ? children : <Navigate to="/admin-login" replace />;
};
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { mode: darkMode } = useSelector((s) => s.theme);

  // Sync dark mode class on body on first render
  useEffect(() => {
    if (darkMode === 'dark') document.body.classList.add('dark');
    else document.body.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    if (user) { dispatch(fetchCart()); dispatch(fetchWishlist()); }
  }, [user, dispatch]);

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main style={{ minHeight: '80vh' }}>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
            <Route path="/product/:id" element={<PageTransition><ProductDetailPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/cart" element={<ProtectedRoute><PageTransition><CartPage /></PageTransition></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><PageTransition><CheckoutPage /></PageTransition></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><PageTransition><WishlistPage /></PageTransition></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><PageTransition><ProfilePage /></PageTransition></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><PageTransition><OrdersPage /></PageTransition></ProtectedRoute>} />
            <Route path="/admin" element={<AdminRoute><PageTransition><AdminPage /></PageTransition></AdminRoute>} />
            <Route path="/admin-login" element={<PageTransition><AdminLoginPage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/reset-password/:token" element={<PageTransition><ResetPasswordPage /></PageTransition>} />
            <Route path="/oauth-success" element={<PageTransition><OAuthSuccess /></PageTransition>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Chatbot />
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2500} theme={darkMode === 'dark' ? 'dark' : 'light'} />
    </>
  );
}
