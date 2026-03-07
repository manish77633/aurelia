import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleWishlist } from '../slices/wishlistSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector(s => s.wishlist);

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
      <FavoriteIcon sx={{ fontSize: 72, color: '#e8e0d6' }} />
      <div className="font-playfair text-2xl md:text-[1.8rem] font-bold text-charcoal">Your wishlist is empty</div>
      <p className="text-gray-400 text-[0.92rem]">Save pieces you love and revisit them anytime.</p>
      <button className="btn-gold" onClick={() => navigate('/shop')}>Explore Collection</button>
    </div>
  );

  return (
    <div className="bg-cream min-h-[80vh] py-8 md:py-10 px-4 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <FavoriteIcon sx={{ color: '#CFA052', fontSize: 22 }} />
          <h1 className="font-playfair text-2xl md:text-[2rem] font-bold text-charcoal">My Wishlist</h1>
          <span className="text-[0.9rem] text-gray-400">({items.length} items)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map(product => {
            if (!product._id) return null;
            return (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)]">

                <div
                  className="relative h-48 bg-[#f5ede0] cursor-pointer"
                  onClick={() => navigate(`/product/${product._id}`)}>
                  <img
                    src={product.image?.startsWith('/uploads') ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${product.image}` : product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="text-[0.65rem] font-bold tracking-[2px] text-gold uppercase mb-1">{product.category}</div>
                  <div
                    className="font-playfair text-[0.95rem] font-bold mb-2.5 cursor-pointer text-charcoal hover:text-gold transition-colors truncate"
                    onClick={() => navigate(`/product/${product._id}`)}>
                    {product.name}
                  </div>
                  <div className="font-playfair text-[1.1rem] font-bold mb-3.5 text-charcoal">${product.price?.toLocaleString()}</div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => { dispatch(addToCart({ productId: product._id, qty: 1 })); toast.success('Added to cart 🛒'); }}
                      className="flex-1 py-2 px-3 bg-gradient-to-br from-gold to-[#E8C97A] border-none rounded-lg text-white font-inter text-[0.8rem] font-bold cursor-pointer flex items-center justify-center gap-1">
                      <ShoppingCartOutlinedIcon sx={{ fontSize: 14 }} /> Add to Cart
                    </button>
                    <button
                      onClick={() => { dispatch(toggleWishlist(product._id)); toast.info('Removed from wishlist'); }}
                      className="w-9 h-9 border-[1.5px] border-red-100 rounded-lg bg-white cursor-pointer flex items-center justify-center hover:bg-red-50 transition-colors">
                      <DeleteOutlineIcon sx={{ fontSize: 16, color: '#f87171' }} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
