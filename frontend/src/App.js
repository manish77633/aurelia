import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';

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
import OAuthSuccess from './pages/OAuthSuccess';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OrdersPage from './pages/OrdersPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';

import { fetchCart } from './slices/cartSlice';
import { fetchWishlist } from './slices/wishlistSlice';

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return user ? children : <Navigate to="/login" replace />;
};
const AdminRoute = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  return user?.role === 'admin' ? children : <Navigate to="/" replace />;
};
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  useEffect(() => {
    if (user) { dispatch(fetchCart()); dispatch(fetchWishlist()); }
  }, [user, dispatch]);

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={2500} theme="light" />
    </>
  );
}
