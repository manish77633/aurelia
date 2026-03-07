import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateCartItem, removeFromCart } from '../slices/cartSlice';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function CartPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector(s => s.cart);
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);
  const shipping = subtotal === 0 ? 0 : (subtotal >= 500 ? 0 : 25);
  const total = subtotal + shipping;
  const validItems = items.filter(i => i.product);

  if (validItems.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
      <ShoppingCartOutlinedIcon sx={{ fontSize: 72, color: '#e8e0d6' }} />
      <div className="font-playfair text-2xl md:text-[1.8rem] font-bold text-charcoal">Your cart is empty</div>
      <p className="text-gray-400 text-[0.92rem]">Discover our curated collection of luxury pieces.</p>
      <button className="btn-gold" onClick={() => navigate('/shop')}>Start Shopping</button>
    </div>
  );

  return (
    <div className="bg-cream min-h-[80vh] py-8 md:py-10 px-4 md:px-12">
      <div className="max-w-[1200px] mx-auto">

        {/* Back button */}
        <div className="flex items-center gap-2 mb-8">
          <button onClick={() => navigate('/shop')} className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[0.85rem] text-gray-400 hover:text-gold transition-colors">
            <ArrowBackIcon sx={{ fontSize: 16 }} /> Continue Shopping
          </button>
        </div>

        <h1 className="font-playfair text-2xl md:text-[2rem] font-bold mb-8 text-charcoal">
          Shopping Cart <span className="text-base font-normal text-gray-400">({validItems.length} items)</span>
        </h1>

        {/* Grid: items | summary */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-7">

          {/* CART ITEMS */}
          <div className="flex flex-col gap-4">
            {items.map(item => {
              const p = item.product;
              if (!p) return null;
              return (
                <div key={item._id} className="bg-white rounded-2xl p-4 md:p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex gap-4 items-center">
                  <img
                    src={p.image?.startsWith('/uploads') ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${p.image}` : p.image}
                    alt={p.name}
                    onClick={() => navigate(`/product/${p._id}`)}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover cursor-pointer bg-[#f5ede0] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.65rem] font-bold tracking-[2px] text-gold uppercase mb-1">{p.category}</div>
                    <div className="font-playfair text-[0.95rem] md:text-[1.05rem] font-bold text-charcoal mb-1 cursor-pointer truncate" onClick={() => navigate(`/product/${p._id}`)}>{p.name}</div>
                    <div className="text-[0.82rem] text-gray-400">In stock</div>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center border-[1.5px] border-[#e8e0d6] rounded-xl overflow-hidden shrink-0">
                    <button
                      onClick={() => item.qty > 1 ? dispatch(updateCartItem({ productId: p._id, qty: item.qty - 1 })) : dispatch(removeFromCart(p._id))}
                      className="w-8 h-8 md:w-9 md:h-9 border-none bg-[#f9f6f1] cursor-pointer flex items-center justify-center hover:bg-[#f0ebe3] transition-colors">
                      <RemoveIcon sx={{ fontSize: 13, color: '#6B7280' }} />
                    </button>
                    <span className="w-8 md:w-9 text-center font-bold text-[0.9rem]">{item.qty}</span>
                    <button
                      onClick={() => dispatch(updateCartItem({ productId: p._id, qty: item.qty + 1 }))}
                      className="w-8 h-8 md:w-9 md:h-9 border-none bg-[#f9f6f1] cursor-pointer flex items-center justify-center hover:bg-[#f0ebe3] transition-colors">
                      <AddIcon sx={{ fontSize: 13, color: '#6B7280' }} />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="font-playfair text-base md:text-[1.15rem] font-bold text-charcoal min-w-[72px] text-right shrink-0">
                    ${(p.price * item.qty).toLocaleString()}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(removeFromCart(p._id))}
                    className="w-9 h-9 border-[1.5px] border-red-100 rounded-xl bg-white cursor-pointer flex items-center justify-center shrink-0 transition-colors hover:bg-red-50">
                    <DeleteOutlineIcon sx={{ fontSize: 18, color: '#f87171' }} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* ORDER SUMMARY */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] h-fit lg:sticky lg:top-[90px]">
            <div className="font-playfair text-[1.15rem] font-bold mb-5 pb-4 border-b border-[#f0ebe3]">Order Summary</div>

            <div className="flex justify-between mb-3 text-[0.9rem] text-gray-500">
              <span>Subtotal</span>
              <span className="font-semibold text-charcoal">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between mb-3 text-[0.9rem] text-gray-500">
              <span>Shipping</span>
              <span className={`font-semibold ${shipping === 0 ? 'text-emerald-500' : 'text-charcoal'}`}>
                {shipping === 0 ? 'FREE' : `$${shipping}`}
              </span>
            </div>

            {shipping > 0 && (
              <div className="bg-[#fef9ec] rounded-xl px-4 py-2.5 text-[0.78rem] text-amber-800 mb-4 flex gap-2 items-center">
                <LocalShippingOutlinedIcon sx={{ fontSize: 14 }} />
                Add ${(500 - subtotal).toFixed(0)} more for free shipping
              </div>
            )}

            <div className="border-t border-[#f0ebe3] pt-4 mt-1 flex justify-between mb-6">
              <span className="font-playfair font-bold text-charcoal">Total</span>
              <span className="font-playfair text-[1.4rem] font-bold text-charcoal">${total.toLocaleString()}</span>
            </div>

            <button
              className="btn-gold w-full py-4 text-[0.95rem] flex items-center justify-center gap-2 mb-4"
              onClick={() => navigate('/checkout')}
              disabled={subtotal === 0}
              style={{ opacity: subtotal === 0 ? 0.5 : 1, cursor: subtotal === 0 ? 'not-allowed' : 'pointer' }}>
              Proceed to Checkout <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[0.78rem] text-gray-400">
              <LockOutlinedIcon sx={{ fontSize: 13 }} /> Secured by Razorpay
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
