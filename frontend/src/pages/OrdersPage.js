import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const STATUS_CONFIG = {
  Processing: { bg: '#fef9ec', color: '#92400e', Icon: HourglassEmptyIcon },
  Confirmed: { bg: '#eff6ff', color: '#1d4ed8', Icon: CheckCircleOutlineIcon },
  Shipped: { bg: '#f0fdf4', color: '#15803d', Icon: LocalShippingOutlinedIcon },
  Delivered: { bg: '#f0fdf4', color: '#15803d', Icon: CheckCircleOutlineIcon },
  Cancelled: { bg: '#fef2f2', color: '#b91c1c', Icon: HourglassEmptyIcon },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/orders/my`, { headers: { Authorization: `Bearer ${user?.token}` } })
      .then(r => setOrders(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-gray-400 text-base">Loading orders...</div>;

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5 px-6 text-center">
      <ShoppingBagOutlinedIcon sx={{ fontSize: 72, color: '#e8e0d6' }} />
      <div className="font-playfair text-2xl md:text-[1.8rem] font-bold text-charcoal">No orders yet</div>
      <p className="text-gray-400 text-[0.92rem]">Your luxury journey awaits.</p>
      <button className="btn-gold" onClick={() => navigate('/shop')}>Start Shopping</button>
    </div>
  );

  return (
    <div className="bg-cream min-h-[80vh] py-12 md:py-16 px-4 md:px-12">
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-10 md:mb-12">
          <h1 className="font-playfair text-3xl md:text-[2.6rem] font-bold mb-3 text-charcoal tracking-tight">My Order History</h1>
          <p className="text-[0.95rem] md:text-base text-gray-500 font-inter">
            A meticulously curated collection of your {orders.length} past acquisition{orders.length !== 1 ? 's' : ''}.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status || 'Processing'] || STATUS_CONFIG.Processing;
            const StatusIcon = cfg.Icon;
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl p-5 md:p-8 shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-gold/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(207,160,82,0.12)]">

                {/* Header */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-5 border-b border-[#f0ebe3]">
                  <div>
                    <div className="text-[0.8rem] font-extrabold text-gold tracking-[2px] mb-1.5 uppercase">
                      ORDER #{order._id?.slice(-8).toUpperCase()}
                    </div>
                    <div className="text-[0.9rem] text-gray-400 font-inter font-medium">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-2 px-4 py-2 rounded-full border text-[0.85rem] font-bold uppercase tracking-wide"
                    style={{ background: cfg.bg, color: cfg.color, borderColor: `${cfg.color}30` }}>
                    <StatusIcon sx={{ fontSize: 18 }} />
                    <span>{order.status || 'Processing'}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {order.orderItems?.map((item, i) => (
                    <div key={i} className="flex gap-4 items-center bg-cream px-3 py-3 rounded-xl border border-[#f5f0e8]">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f5ede0] shrink-0 border border-black/5">
                        <img
                          src={item.image?.startsWith('/uploads') ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${item.image}` : item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-playfair text-[0.95rem] font-bold text-charcoal truncate mb-1">{item.name}</div>
                        <div className="flex justify-between text-[0.85rem] text-gray-500">
                          <span>Qty: <span className="font-semibold text-charcoal">{item.qty}</span></span>
                          <span className="font-semibold text-gold">${item.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-5 border-t border-[#f0ebe3]">
                  {order.shippingAddress ? (
                    <div className="flex-1 sm:pr-5">
                      <div className="text-[0.72rem] font-bold text-gray-400 tracking-widest uppercase mb-1.5">Delivery Address</div>
                      <div className="text-[0.9rem] text-gray-600 leading-relaxed">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                        {order.shippingAddress.country}
                      </div>
                    </div>
                  ) : <div className="flex-1" />}
                  <div className="bg-cream px-6 py-4 rounded-xl border border-[#e8e0d6] text-right shrink-0">
                    <div className="text-[0.75rem] font-bold text-gray-400 tracking-widest uppercase mb-1">Total Investment</div>
                    <div className="font-playfair text-[1.6rem] md:text-[1.8rem] font-bold text-charcoal">
                      ${order.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-3 bg-gradient-to-br from-charcoal to-[#333] text-white border-none px-8 py-4 rounded-xl font-inter text-base font-bold cursor-pointer shadow-[0_8px_24px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.2)]">
            Continue Shopping <ArrowForwardIcon sx={{ fontSize: 18, color: '#CFA052' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
