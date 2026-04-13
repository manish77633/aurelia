import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { addToCart } from '../../slices/cartSlice';
import { toggleWishlist } from '../../slices/wishlistSlice';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StarIcon from '@mui/icons-material/Star';

export default function ProductCard({ product, onQuickView }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { items: wishlist } = useSelector((s) => s.wishlist);
  const isWished = wishlist.some(p => (p._id || p) === product._id);

  const handleCart = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    dispatch(addToCart({ productId: product._id, qty: 1 }));
    toast.success(`${product.name} added to cart 🛒`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    dispatch(toggleWishlist(product._id));
    toast.info(isWished ? 'Removed from wishlist' : 'Saved to wishlist');
  };

  const handleQuickView = (e) => {
    e.stopPropagation();
    if (onQuickView) onQuickView(product);
  };

  const imgSrc = product.image?.startsWith('/uploads')
    ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${product.image}`
    : product.image;

  return (
    <motion.div
      onClick={() => navigate(`/product/${product._id}`)}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-50 overflow-hidden cursor-pointer relative transition-all duration-300 hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)]">

      {/* Image */}
      <div className="relative h-48 md:h-60 overflow-hidden bg-[#f5f0e8] group">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gold text-white text-[0.68rem] font-bold px-2.5 py-1 rounded-full tracking-wider">
            FEATURED
          </span>
        )}
        {/* Wishlist btn */}
        <button
          onClick={handleWishlist}
          className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.1)] transition-all duration-200 hover:scale-110 hover:bg-white">
          {isWished
            ? <FavoriteIcon sx={{ fontSize: 18, color: '#CFA052' }} />
            : <FavoriteBorderIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />}
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
          <button
            onClick={handleQuickView}
            className="px-5 py-2.5 bg-white text-charcoal rounded-full text-[0.75rem] font-bold uppercase tracking-wider hover:bg-gold hover:text-white transition-all duration-200"
          >
            Quick Look
          </button>
          <button
            onClick={handleCart}
            className="px-5 py-2.5 bg-gold text-white rounded-full text-[0.75rem] font-bold uppercase tracking-wider hover:bg-white hover:text-charcoal transition-all duration-200"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3.5 pb-5">
        <div className="text-[0.65rem] font-bold tracking-[2px] text-gold uppercase mb-1.5">{product.category}</div>
        <div className="font-playfair text-[1rem] font-semibold text-charcoal mb-2 leading-snug line-clamp-2">{product.name}</div>
        <div className="flex items-center gap-1 mb-2.5">
          <StarIcon sx={{ fontSize: 14, color: '#CFA052' }} />
          <span className="text-[0.78rem] font-semibold text-charcoal">{product.rating?.toFixed(1)}</span>
          <span className="text-[0.75rem] text-gray-400">({product.numReviews})</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-playfair text-[1.2rem] font-bold text-charcoal">${product.price.toLocaleString()}</span>
          <button
            onClick={handleCart}
            className="bg-gold border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer text-white shadow-[0_3px_12px_rgba(207,160,82,0.4)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_20px_rgba(207,160,82,0.6)]">
            <ShoppingCartOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
