// Navbar.js uses Tailwind classes for responsive layout, incorporating a hamburger menu for mobile.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../slices/authSlice';
import { resetCart } from '../../slices/cartSlice';
import { resetWishlist } from '../../slices/wishlistSlice';
import { toast } from 'react-toastify';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import SearchIcon from '@mui/icons-material/Search';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { items: cartItems } = useSelector((s) => s.cart);
  const { items: wishItems } = useSelector((s) => s.wishlist);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  // Filter items to ensure product actually exists, avoiding counting deleted products
  const validCartItems = cartItems.filter(i => i.product);
  const cartCount = validCartItems.reduce((s, i) => s + i.qty, 0);
  const wishCount = wishItems.filter(i => i._id).length;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu and search on route change
  useEffect(() => {
    setMobileOpen(false);
    setIsSearchOpen(false);
    setNavSearch('');
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(navSearch.trim())}`);
      setIsSearchOpen(false);
      setNavSearch('');
    }
  };

  const handleLogout = () => {
    dispatch(logout()); dispatch(resetCart()); dispatch(resetWishlist());
    toast.info('Logged out.'); navigate('/');
    setMobileOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] h-[70px] transition-all duration-300 flex items-center justify-between px-6 md:px-12 ${scrolled ? 'bg-[#FAFAFA]/95 backdrop-blur-md border-b border-gold/20 shadow-sm' : 'bg-[#FAFAFA]/95 backdrop-blur-md border-b border-gold/10'}`}>

        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 no-underline z-[1001]">
          <DiamondOutlinedIcon sx={{ color: '#CFA052', fontSize: 22 }} />
          <span className="font-playfair text-xl font-bold text-charcoal tracking-tight">
            Aurelia <span className="text-gold">Luxe</span>
          </span>
        </Link>

        {/* MOBILE MENU TOGGLE */}
        <button
          className="md:hidden text-charcoal z-[1001] p-1.5 rounded-lg hover:bg-gold/10 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-8 items-center h-full">
          <Link to="/" className={`font-inter text-[0.88rem] font-medium tracking-wide transition-colors ${location.pathname === '/' ? 'text-gold' : 'text-charcoal hover:text-gold'}`}>
            Home
          </Link>

          {/* MEN MEGA MENU */}
          <div className="group h-full flex items-center">
            <Link to="/shop?gender=Men" className={`font-inter text-[0.88rem] font-medium tracking-wide transition-colors flex items-center gap-1 cursor-pointer h-full ${location.search.includes('gender=Men') ? 'text-gold' : 'text-charcoal hover:text-gold'}`}>
              Men <span className="text-[0.6rem] transition-transform duration-300 group-hover:rotate-180">▼</span>
            </Link>
            {/* Dropdown */}
            <div className="absolute top-[70px] left-0 right-0 bg-white border-b border-gold/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
              <div className="max-w-[1280px] mx-auto px-12 py-10 grid grid-cols-4 gap-12">
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[3px] text-gold uppercase mb-5">Apparel</div>
                  <div className="flex flex-col gap-3">
                    {['Shirt', 'T-shirt', 'Coat'].map(sub => (
                      <Link key={sub} to={`/shop?gender=Men&subCategory=Men ${sub}`} className="text-charcoal hover:text-gold text-[0.9rem] transition-colors">{sub}s</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[3px] text-gold uppercase mb-5">Footwear</div>
                  <div className="flex flex-col gap-3">
                    {['Sport Shoe', 'Boot'].map(sub => (
                      <Link key={sub} to={`/shop?gender=Men&subCategory=Men ${sub}`} className="text-charcoal hover:text-gold text-[0.9rem] transition-colors">{sub}s</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[3px] text-gold uppercase mb-5">Accessories</div>
                  <div className="flex flex-col gap-3">
                    <Link to="/shop?gender=Men&subCategory=Men Watch" className="text-charcoal hover:text-gold text-[0.9rem] transition-colors">Watches</Link>
                  </div>
                </div>
                <div className="bg-cream rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden group/img">
                  <img src="https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600&q=80" alt="Men's Collection" className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-700 group-hover/img:scale-110" />
                  <div className="relative z-10">
                    <div className="font-playfair text-xl font-bold text-charcoal mb-2">Heritage Men</div>
                    <Link to="/shop?gender=Men" className="text-gold font-bold text-[0.8rem] uppercase tracking-widest hover:underline">Explore All</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WOMEN MEGA MENU */}
          <div className="group h-full flex items-center">
            <Link to="/shop?gender=Women" className={`font-inter text-[0.88rem] font-medium tracking-wide transition-colors flex items-center gap-1 cursor-pointer h-full ${location.search.includes('gender=Women') ? 'text-gold' : 'text-charcoal hover:text-gold'}`}>
              Women <span className="text-[0.6rem] transition-transform duration-300 group-hover:rotate-180">▼</span>
            </Link>
            {/* Dropdown */}
            <div className="absolute top-[70px] left-0 right-0 bg-white border-b border-gold/10 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 overflow-hidden">
              <div className="max-w-[1280px] mx-auto px-12 py-10 grid grid-cols-4 gap-12">
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[3px] text-gold uppercase mb-5">Apparel</div>
                  <div className="flex flex-col gap-3">
                    {['Shirt', 'T-shirt', 'Coat'].map(sub => (
                      <Link key={sub} to={`/shop?gender=Women&subCategory=Women ${sub}`} className="text-charcoal hover:text-gold text-[0.9rem] transition-colors">{sub}s</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[3px] text-gold uppercase mb-5">Footwear</div>
                  <div className="flex flex-col gap-3">
                    {['Sport Shoe', 'Boot'].map(sub => (
                      <Link key={sub} to={`/shop?gender=Women&subCategory=Women ${sub}`} className="text-charcoal hover:text-gold text-[0.9rem] transition-colors">{sub}s</Link>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[0.7rem] font-bold tracking-[3px] text-gold uppercase mb-5">Accessories</div>
                  <div className="flex flex-col gap-3">
                    <Link to="/shop?gender=Women&subCategory=Women Watch" className="text-charcoal hover:text-gold text-[0.9rem] transition-colors">Watches</Link>
                    <Link to="/shop?gender=Women&subCategory=Women Bag" className="text-charcoal hover:text-gold text-[0.9rem] transition-colors">Bags</Link>
                  </div>
                </div>
                <div className="bg-cream rounded-2xl p-6 flex flex-col justify-end relative overflow-hidden group/img">
                  <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80" alt="Women's Collection" className="absolute inset-0 w-full h-full object-cover opacity-10 transition-transform duration-700 group-hover/img:scale-110" />
                  <div className="relative z-10">
                    <div className="font-playfair text-xl font-bold text-charcoal mb-2">Grace Women</div>
                    <Link to="/shop?gender=Women" className="text-gold font-bold text-[0.8rem] uppercase tracking-widest hover:underline">Explore All</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link to="/shop" className={`font-inter text-[0.88rem] font-medium tracking-wide transition-colors ${location.pathname === '/shop' && !location.search ? 'text-gold' : 'text-charcoal hover:text-gold'}`}>
            Full Collection
          </Link>
          <Link to="/about" className={`font-inter text-[0.88rem] font-medium tracking-wide transition-colors ${location.pathname === '/about' ? 'text-gold' : 'text-charcoal hover:text-gold'}`}>
            About
          </Link>
        </div>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-2">
          {/* Search Box */}
          <div className="relative flex items-center h-full mr-2">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center bg-[#f5f0e8] rounded-full transition-all duration-300 overflow-hidden ${isSearchOpen ? 'w-[200px] border border-gold/30 px-3' : 'w-[40px] px-0 justify-center cursor-pointer hover:bg-gold/10 hover:text-gold'}`}
              onClick={() => !isSearchOpen && setIsSearchOpen(true)}
            >
              <SearchIcon
                sx={{ fontSize: 20, color: isSearchOpen ? '#CFA052' : '#6B7280' }}
                className="shrink-0"
              />
              <input
                type="text"
                placeholder="Search..."
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                autoFocus={isSearchOpen}
                onBlur={() => !navSearch && setIsSearchOpen(false)}
                className={`border-none bg-transparent h-9 text-[0.85rem] font-inter outline-none transition-all duration-300 ${isSearchOpen ? 'w-full ml-2 opacity-100' : 'w-0 opacity-0'}`}
              />
            </form>
          </div>

          {user ? (
            <>
              {/* Wishlist */}
              <Link to="/wishlist" className="relative text-gray-500 hover:text-gold transition-colors p-2 rounded-lg" title="Wishlist">
                {wishCount > 0 ? <FavoriteIcon sx={{ fontSize: 22, color: '#CFA052' }} /> : <FavoriteBorderIcon sx={{ fontSize: 22 }} />}
                {wishCount > 0 && <span className="absolute top-0 right-0 bg-gold text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-white">{wishCount}</span>}
              </Link>
              {/* Cart */}
              <Link to="/cart" className="relative text-gray-500 hover:text-gold transition-colors p-2 rounded-lg" title="Cart">
                <ShoppingCartOutlinedIcon sx={{ fontSize: 22 }} />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-charcoal text-white text-[0.6rem] font-bold w-4 h-4 rounded-full flex items-center justify-center border-[1.5px] border-white">{cartCount}</span>}
              </Link>
              {/* Orders */}
              <Link to="/orders" className="text-gray-500 hover:text-gold transition-colors p-2 rounded-lg" title="My Orders">
                <LocalMallOutlinedIcon sx={{ fontSize: 22 }} />
              </Link>
              {/* Profile */}
              <Link to="/profile" className="text-gray-500 hover:text-gold transition-colors p-2 rounded-lg" title="Profile">
                <PersonOutlineIcon sx={{ fontSize: 22 }} />
              </Link>
              {/* Admin */}
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-500 hover:text-gold transition-colors p-2 rounded-lg" title="Admin">
                  <SettingsOutlinedIcon sx={{ fontSize: 22 }} />
                </Link>
              )}
              {/* Logout */}
              <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-500 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-gradient-to-br hover:from-gold hover:to-[#E8C97A] hover:text-white hover:-translate-y-0.5 hover:shadow-md">
                <LogoutIcon sx={{ fontSize: 18 }} />
                <span className="text-[0.82rem] font-semibold">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-inter text-[0.88rem] font-semibold text-charcoal px-4 py-2 hover:text-gold transition-colors">Login</Link>
              <Link to="/register" className="bg-gold text-white font-inter text-[0.88rem] font-semibold px-5 py-2 rounded-lg transition-all duration-200 shadow-[0_3px_12px_rgba(207,160,82,0.3)] hover:bg-[#b8883a]">Register</Link>
            </>
          )}
        </div>
      </nav>

      {/* MOBILE OVERLAY MENU — outside <nav> so it's not clipped */}
      <div className={`fixed inset-0 bg-white z-[999] flex flex-col pt-[70px] md:hidden transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col px-6 pt-5 pb-6 overflow-y-auto h-full">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative">
              <SearchIcon sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 18 }} />
              <input
                type="text"
                placeholder="Search items..."
                value={navSearch}
                onChange={e => setNavSearch(e.target.value)}
                className="w-full py-3 pr-4 pl-11 border border-[#e8e0d6] rounded-xl font-inter text-[0.9rem] bg-[#FAFAFA] outline-none focus:border-gold transition-colors"
              />
            </div>
          </form>

          {/* Nav Links */}
          <div className="flex flex-col gap-1 mb-8">
            {[
              ['/', 'Home'],
              ['/shop?gender=Men', 'Men'],
              ['/shop?gender=Women', 'Women'],
              ['/shop', 'Full Collection'],
              ['/about', 'About']
            ].map(([path, label]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMobileOpen(false)}
                className={`font-playfair text-2xl font-semibold py-3 border-b border-gray-100 transition-colors ${location.pathname + location.search === path ? 'text-gold' : 'text-charcoal hover:text-gold'}`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex flex-col gap-3">
            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 pb-4 mb-2 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#f5ede0] flex items-center justify-center font-playfair font-bold text-gold text-lg">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-charcoal text-sm">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </div>
                </div>

                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-charcoal font-inter py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <FavoriteBorderIcon sx={{ fontSize: 20, color: '#CFA052' }} />
                  <span className="font-medium">Wishlist</span>
                  {wishCount > 0 && <span className="ml-auto bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">{wishCount}</span>}
                </Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-charcoal font-inter py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <ShoppingCartOutlinedIcon sx={{ fontSize: 20, color: '#CFA052' }} />
                  <span className="font-medium">Cart</span>
                  {cartCount > 0 && <span className="ml-auto bg-charcoal text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartCount}</span>}
                </Link>
                <Link to="/orders" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-charcoal font-inter py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <LocalMallOutlinedIcon sx={{ fontSize: 20, color: '#CFA052' }} />
                  <span className="font-medium">My Orders</span>
                </Link>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-charcoal font-inter py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <PersonOutlineIcon sx={{ fontSize: 20, color: '#CFA052' }} />
                  <span className="font-medium">Profile</span>
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="flex items-center gap-3 text-charcoal font-inter py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <SettingsOutlinedIcon sx={{ fontSize: 20, color: '#CFA052' }} />
                    <span className="font-medium">Admin Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-500 font-inter py-2.5 px-3 rounded-xl hover:bg-red-50 transition-colors mt-2 w-full text-left"
                >
                  <LogoutIcon sx={{ fontSize: 20 }} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full text-center border-2 border-charcoal text-charcoal py-3.5 rounded-xl font-semibold text-base transition-all hover:border-gold hover:text-gold">Login</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full text-center bg-gold text-white py-3.5 rounded-xl font-semibold text-base shadow-[0_3px_12px_rgba(207,160,82,0.3)] hover:bg-[#b8883a] transition-all">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[70px]" />
    </>
  );
}
