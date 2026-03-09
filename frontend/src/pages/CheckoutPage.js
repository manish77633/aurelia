import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { clearCart } from '../slices/cartSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

const STEPS = ['Personal Details', 'Shipping Address', 'Payment'];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(s => s.auth);
  const { items } = useSelector(s => s.cart);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: user?.name || '', email: user?.email || '', phone: '',
    address: '', city: '', postalCode: '', country: 'India',
  });
  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [codLoading, setCodLoading] = useState(false);

  const total = items.reduce((s, i) => s + (i.product?.price || 0) * i.qty, 0);
  const API = process.env.REACT_APP_API_URL;

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = 'Full name required';
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
      if (!form.phone.trim() || form.phone.length < 10) e.phone = 'Valid phone required';
    }
    if (step === 1) {
      if (!form.address.trim()) e.address = 'Address required';
      if (!form.city.trim()) e.city = 'City required';
      if (!form.postalCode.trim()) e.postalCode = 'Postal code required';
      if (!form.country.trim()) e.country = 'Country required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => { if (validate()) setStep(s => s + 1); };

  const handleRazorpay = async () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK not loaded. Please refresh the page and try again.');
      return;
    }
    try {
      const { data } = await axios.post(`${API}/payment/create-order`, { amount: total },
        { headers: { Authorization: `Bearer ${user.token}` } });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount, currency: data.currency, name: 'Aurelia Luxe',
        description: 'Premium Purchase',
        order_id: data.orderId,
        prefill: { name: form.fullName, email: form.email, contact: form.phone },
        theme: { color: '#CFA052' },
        handler: async (response) => {
          try {
            await axios.post(`${API}/payment/verify`, response, { headers: { Authorization: `Bearer ${user.token}` } });
            const orderItems = items.map(i => ({ name: i.product.name, qty: i.qty, image: i.product.image, price: i.product.price, product: i.product._id }));
            await axios.post(`${API}/orders`, {
              orderItems,
              shippingAddress: { address: form.address, city: form.city, postalCode: form.postalCode, country: form.country },
              paymentMethod: 'Razorpay', itemsPrice: total, shippingPrice: 0, taxPrice: 0, totalPrice: total,
              paymentResult: { ...response, status: 'paid' },
            }, { headers: { Authorization: `Bearer ${user.token}` } });
            dispatch(clearCart());
            toast.success('Order placed successfully! 🎉');
            navigate('/orders');
          } catch (err) {
            console.error('Order creation after payment failed:', err);
            toast.error(err.response?.data?.message || 'Order creation failed after payment.');
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        console.error('Razorpay payment failed:', resp.error);
        toast.error(`Payment failed: ${resp.error.description || resp.error.reason || 'Unknown error'}`);
      });
      rzp.open();
    } catch (err) {
      console.error('Razorpay order creation failed:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || 'Payment initiation failed. Check console for details.');
    }
  };

  // ── COD handler ──
  const handleCOD = async () => {
    setCodLoading(true);
    try {
      const orderItems = items.map(i => ({ name: i.product.name, qty: i.qty, image: i.product.image, price: i.product.price, product: i.product._id }));
      await axios.post(`${API}/orders`, {
        orderItems,
        shippingAddress: { address: form.address, city: form.city, postalCode: form.postalCode, country: form.country },
        paymentMethod: 'COD', itemsPrice: total, shippingPrice: 0, taxPrice: 0, totalPrice: total,
      }, { headers: { Authorization: `Bearer ${user.token}` } });
      dispatch(clearCart());
      toast.success('Order placed! Pay on delivery 🎉');
      navigate('/orders');
    } catch (err) {
      console.error('COD order failed:', err);
      toast.error(err.response?.data?.message || 'Failed to place order.');
    }
    setCodLoading(false);
  };

  const icons = [PersonOutlineIcon, HomeOutlinedIcon, PaymentOutlinedIcon];

  return (
    <div className="bg-cream min-h-[80vh] py-8 md:py-10 px-4 md:px-12">
      <div className="max-w-[900px] mx-auto">
        <h1 className="font-playfair text-2xl md:text-[2rem] font-bold mb-9 text-center text-charcoal">Checkout</h1>

        {/* STEPPER */}
        <div className="flex items-start justify-center mb-10 md:mb-12 gap-0">
          {STEPS.map((s, i) => {
            const Icon = icons[i];
            return (
              <React.Fragment key={i}>
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 ${i <= step ? 'bg-gold' : 'bg-[#f0ebe3]'}`}>
                    {i < step
                      ? <CheckCircleOutlineIcon sx={{ fontSize: 22, color: '#fff' }} />
                      : <Icon sx={{ fontSize: 20, color: i === step ? '#fff' : '#9CA3AF' }} />}
                  </div>
                  <span className={`text-[0.65rem] md:text-[0.72rem] font-semibold ${i === step ? 'text-gold' : 'text-gray-400'}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-[1px] mx-2 mt-5 min-w-[30px] md:min-w-[80px] transition-all duration-300 ${i < step ? 'bg-gold' : 'bg-[#e8e0d6]'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Main grid: Form + Sidebar */}
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-6 lg:gap-7">

          {/* FORM PANEL */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">

            {/* STEP 0: Personal */}
            {step === 0 && (
              <div>
                <h2 className="font-playfair text-[1.3rem] font-bold mb-6 text-charcoal">Personal Details</h2>
                {[
                  { key: 'fullName', label: 'Full Name', type: 'text', ph: 'Manish Kumar' },
                  { key: 'email', label: 'Email Address', type: 'email', ph: 'you@example.com' },
                  { key: 'phone', label: 'Phone Number', type: 'tel', ph: '+91 9876543210' },
                ].map(({ key, label, type, ph }) => (
                  <div key={key} className="mb-5">
                    <label className="block text-[0.78rem] font-bold text-charcoal mb-2 tracking-wide">{label}</label>
                    <input
                      type={type} placeholder={ph} value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className={`w-full px-3.5 py-3 border-[1.5px] rounded-xl font-inter text-[0.92rem] text-charcoal bg-cream outline-none transition-colors focus:border-gold ${errors[key] ? 'border-red-400' : 'border-[#e8e0d6]'}`}
                    />
                    {errors[key] && <span className="text-[0.75rem] text-red-400 mt-1 block">{errors[key]}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1: Shipping */}
            {step === 1 && (
              <div>
                <h2 className="font-playfair text-[1.3rem] font-bold mb-6 text-charcoal">Shipping Address</h2>
                {[
                  { key: 'address', label: 'Street Address', ph: '123 Luxury Lane' },
                  { key: 'city', label: 'City', ph: 'Mumbai' },
                  { key: 'postalCode', label: 'Postal Code', ph: '400001' },
                  { key: 'country', label: 'Country', ph: 'India' },
                ].map(({ key, label, ph }) => (
                  <div key={key} className="mb-5">
                    <label className="block text-[0.78rem] font-bold text-charcoal mb-2 tracking-wide">{label}</label>
                    <input
                      type="text" placeholder={ph} value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className={`w-full px-3.5 py-3 border-[1.5px] rounded-xl font-inter text-[0.92rem] text-charcoal bg-cream outline-none transition-colors focus:border-gold ${errors[key] ? 'border-red-400' : 'border-[#e8e0d6]'}`}
                    />
                    {errors[key] && <span className="text-[0.75rem] text-red-400 mt-1 block">{errors[key]}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div>
                <h2 className="font-playfair text-[1.3rem] font-bold mb-6 text-charcoal">Payment</h2>
                <div className="bg-cream rounded-xl p-5 border border-[#f0ebe3] mb-6">
                  <div className="font-bold mb-3 text-[0.9rem] text-charcoal">Order Summary</div>
                  {items.map(i => (
                    <div key={i._id} className="flex justify-between text-[0.85rem] text-gray-500 mb-2">
                      <span>{i.product?.name} × {i.qty}</span>
                      <span>${((i.product?.price || 0) * i.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="border-t border-[#f0ebe3] mt-3 pt-3 flex justify-between font-bold font-playfair text-[1.1rem] text-charcoal">
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div className="mb-5">
                  <label className="block text-[0.78rem] font-bold text-charcoal mb-3 tracking-wide">Choose Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Razorpay Option */}
                    <button
                      onClick={() => setPaymentMethod('Razorpay')}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${paymentMethod === 'Razorpay'
                          ? 'border-[#CFA052] bg-[#fef9ec] shadow-[0_0_0_1px_rgba(207,160,82,0.3)]'
                          : 'border-[#e8e0d6] bg-white hover:border-[#d4c4a8]'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <PaymentOutlinedIcon sx={{ fontSize: 18, color: paymentMethod === 'Razorpay' ? '#CFA052' : '#9CA3AF' }} />
                        <span className={`text-[0.88rem] font-bold ${paymentMethod === 'Razorpay' ? 'text-[#CFA052]' : 'text-charcoal'}`}>Razorpay</span>
                      </div>
                      <p className="text-[0.72rem] text-gray-400 leading-snug">Cards, UPI, Netbanking, Wallets</p>
                    </button>

                    {/* COD Option */}
                    <button
                      onClick={() => setPaymentMethod('COD')}
                      className={`p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${paymentMethod === 'COD'
                          ? 'border-[#CFA052] bg-[#fef9ec] shadow-[0_0_0_1px_rgba(207,160,82,0.3)]'
                          : 'border-[#e8e0d6] bg-white hover:border-[#d4c4a8]'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: paymentMethod === 'COD' ? '#CFA052' : '#9CA3AF' }} />
                        <span className={`text-[0.88rem] font-bold ${paymentMethod === 'COD' ? 'text-[#CFA052]' : 'text-charcoal'}`}>Cash on Delivery</span>
                      </div>
                      <p className="text-[0.72rem] text-gray-400 leading-snug">Pay when your order arrives</p>
                    </button>
                  </div>
                </div>

                <div className="bg-[#f5f0e8] rounded-xl px-4 py-3.5 text-[0.82rem] text-gray-500 mb-5 flex gap-2">
                  {paymentMethod === 'Razorpay'
                    ? '🔒 Secured by Razorpay. Your payment information is encrypted and never stored.'
                    : '📦 Cash on Delivery — Pay when your order is delivered to your doorstep.'}
                </div>

                <button
                  className="btn-gold w-full py-4 text-[1rem] flex items-center justify-center gap-2"
                  onClick={paymentMethod === 'Razorpay' ? handleRazorpay : handleCOD}
                  disabled={codLoading}
                >
                  {paymentMethod === 'Razorpay' ? (
                    <><PaymentOutlinedIcon sx={{ fontSize: 20 }} /> Pay ${total.toFixed(2)} with Razorpay</>
                  ) : (
                    codLoading ? 'Placing Order...' : <><LocalShippingOutlinedIcon sx={{ fontSize: 20 }} /> Place COD Order — ${total.toFixed(2)}</>
                  )}
                </button>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between mt-7">
              {step > 0 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="bg-transparent border-[1.5px] border-[#e8e0d6] px-6 py-3 rounded-xl font-inter text-[0.9rem] font-semibold cursor-pointer text-gray-500 hover:border-gray-400 transition-colors">
                  ← Back
                </button>
              )}
              {step < 2 && (
                <button onClick={handleNext} className="btn-gold ml-auto px-8 py-3">
                  Continue →
                </button>
              )}
            </div>
          </div>

          {/* ORDER SUMMARY SIDEBAR */}
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] h-fit lg:sticky lg:top-[90px]">
            <div className="font-playfair font-semibold text-base mb-4 pb-3 border-b border-[#f0ebe3] text-charcoal">Your Order</div>
            {items.map(i => (
              <div key={i._id} className="flex gap-3 mb-4">
                <img
                  src={i.product?.image?.startsWith('/uploads') ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${i.product.image}` : i.product?.image}
                  className="w-12 h-12 rounded-lg object-cover shrink-0" alt=""
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[0.82rem] font-semibold leading-snug truncate text-charcoal">{i.product?.name}</div>
                  <div className="text-[0.78rem] text-gray-400">Qty: {i.qty}</div>
                  <div className="text-[0.85rem] font-bold text-gold">${((i.product?.price || 0) * i.qty).toFixed(2)}</div>
                </div>
              </div>
            ))}
            <div className="border-t border-[#f0ebe3] pt-4 flex justify-between">
              <span className="font-bold text-charcoal">Total</span>
              <span className="font-playfair font-bold text-[1.2rem] text-charcoal">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
