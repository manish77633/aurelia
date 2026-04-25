import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import { fetchProductById, submitReview } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { toggleWishlist } from '../slices/wishlistSlice';
import Loader from '../components/ui/Loader';
import ProductCard from '../components/ui/ProductCard';
import ProductSkeletonCard from '../components/ui/ProductSkeletonCard';
import QuickViewModal from '../components/ui/QuickViewModal';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BoltIcon from '@mui/icons-material/Bolt';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReplayIcon from '@mui/icons-material/Replay';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { current: product, loading } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);
  const { items: wishlist } = useSelector((s) => s.wishlist);
  const isWished = wishlist.some(p => (p._id || p) === id);
  const [related, setRelated] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    if (product) setSelectedImage(product.image);
  }, [product]);

  useEffect(() => {
    dispatch(fetchProductById(id));
    setRelatedLoading(true);
    axios.get(`${process.env.REACT_APP_API_URL}/products/${id}/related`)
      .then(r => setRelated(r.data))
      .catch(() => { })
      .finally(() => setRelatedLoading(false));
  }, [dispatch, id]);

  const handleCart = () => {
    if (!user) { navigate('/login'); return; }
    dispatch(addToCart({ productId: id, qty: 1 }));
    toast.success(`${product.name} added to cart 🛒`);
  };
  const handleBuyNow = () => {
    if (!user) { navigate('/login'); return; }
    dispatch(addToCart({ productId: id, qty: 1 }));
    navigate('/checkout');
  };
  const handleWishlist = () => {
    if (!user) { navigate('/login'); return; }
    dispatch(toggleWishlist(id));
    toast.info(isWished ? 'Removed from wishlist' : 'Saved to wishlist');
  };
  const handleReviewSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    if (!reviewComment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    const r = await dispatch(submitReview({ productId: id, rating: reviewRating, comment: reviewComment }));
    if (r.error) toast.error(r.payload || 'Review failed');
    else { toast.success('Review submitted ✨'); setReviewComment(''); dispatch(fetchProductById(id)); }
    setSubmitting(false);
  };

  if (loading || !product) return <Loader />;

  return (
    <div className="bg-cream min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8 md:py-10">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 bg-transparent border-none text-[0.88rem] text-gray-500 cursor-pointer mb-7 p-0 hover:text-gold transition-colors">
          <ArrowBackIcon sx={{ fontSize: 16 }} /> Back to Collection
        </button>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 mb-16 md:mb-20">

          {/* LEFT: IMAGE & GALLERY */}
          <div className="flex flex-col gap-4">
            <div className="rounded-3xl overflow-hidden bg-[#f5ede0] aspect-square relative shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <img
                src={selectedImage?.startsWith('/uploads') ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${selectedImage}` : selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
              {product.featured && (
                <span className="absolute top-5 left-5 bg-gold text-white text-[0.7rem] font-bold px-4 py-1.5 rounded-full tracking-widest shadow-lg">FEATURED</span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {product.images.map((img, idx) => {
                  const isSelected = selectedImage === img;
                  const fullUrl = img.startsWith('/uploads') ? `${process.env.REACT_APP_API_URL.replace('/api', '')}${img}` : img;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`aspect-square rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${isSelected ? 'border-gold shadow-md scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                      <img src={fullUrl} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: DETAILS */}
          <div className="flex flex-col justify-center">
            <div className="text-[0.68rem] font-bold tracking-[3px] text-gold uppercase mb-2.5">{product.category}</div>
            <h1 className="font-playfair text-3xl md:text-[2.4rem] font-bold text-charcoal leading-tight mb-4">{product.name}</h1>

            {/* Stars */}
            <div className="flex items-center gap-1.5 mb-2">
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={`text-base md:text-[1rem] ${i <= Math.round(product.rating) ? 'text-gold' : 'text-[#e0d6c8]'}`}>★</span>
              ))}
              <span className="text-[0.85rem] text-gray-500 ml-1">{product.rating?.toFixed(1)} · {product.numReviews} reviews</span>
            </div>

            {/* Price */}
            <div className="font-playfair text-3xl md:text-[2.2rem] font-bold text-charcoal my-4">
              ${product.price?.toLocaleString()}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className="mb-5">
                <div className="text-[0.75rem] font-bold text-gray-500 mb-2 tracking-wide uppercase">Available in</div>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map(c => (
                    <span key={c} className="px-3.5 py-1 rounded-full border border-[#e8e0d6] text-[0.78rem] text-gray-500 bg-white">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-[0.92rem] text-gray-500 leading-relaxed mb-7">{product.description}</p>

            {/* Actions */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <button
                onClick={handleCart}
                className="flex-1 min-w-[140px] bg-gradient-to-br from-gold to-[#E8C97A] border-none text-white font-inter text-[0.95rem] font-bold py-4 px-6 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(207,160,82,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(207,160,82,0.5)]">
                <ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} /> Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="py-4 px-5 bg-charcoal text-white border-none rounded-xl font-inter text-[0.95rem] font-bold cursor-pointer flex items-center gap-2 transition-all duration-300 hover:bg-[#333]">
                <BoltIcon sx={{ fontSize: 18 }} /> Buy Now
              </button>
              <button
                onClick={handleWishlist}
                className={`w-12 h-12 md:w-14 border-[1.5px] rounded-xl bg-white cursor-pointer flex items-center justify-center transition-all duration-200 ${isWished ? 'border-gold' : 'border-[#e8e0d6]'}`}>
                {isWished
                  ? <FavoriteIcon sx={{ fontSize: 20, color: '#CFA052' }} />
                  : <FavoriteBorderIcon sx={{ fontSize: 20, color: '#9CA3AF' }} />}
              </button>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 md:gap-5 border-t border-[#f0ebe3] pt-5">
              {[
                { Icon: VerifiedOutlinedIcon, text: 'Authenticity Certified' },
                { Icon: LocalShippingOutlinedIcon, text: 'Free Express Delivery' },
                { Icon: ReplayIcon, text: '30-Day Returns' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon sx={{ fontSize: 16, color: '#CFA052' }} />
                  <span className="text-[0.75rem] text-gray-500">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* REVIEWS */}
        <div className="mb-16 md:mb-20">
          <h2 className="font-playfair text-2xl md:text-[1.8rem] font-bold mb-7 text-charcoal">Customer Reviews</h2>

          {/* Write review */}
          <div className="bg-white rounded-2xl p-6 md:p-7 mb-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
            <div className="font-playfair text-[1.05rem] font-semibold mb-4 text-charcoal">Share Your Experience</div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(i => (
                <span
                  key={i}
                  className={`text-[1.6rem] cursor-pointer transition-all duration-75 ${i <= (hoverStar || reviewRating) ? 'text-gold' : 'text-[#e0d6c8]'}`}
                  onMouseEnter={() => setHoverStar(i)}
                  onMouseLeave={() => setHoverStar(0)}
                  onClick={() => setReviewRating(i)}>★</span>
              ))}
            </div>
            <textarea
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              placeholder="What did you love about this piece?"
              className="w-full min-h-[90px] resize-y border-[1.5px] border-[#e8e0d6] rounded-xl p-3.5 font-inter text-[0.9rem] outline-none mb-4 bg-cream focus:border-gold transition-colors"
            />
            <button onClick={handleReviewSubmit} disabled={submitting} className="btn-gold text-[0.85rem]">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>

          {/* Existing reviews */}
          <div className="flex flex-col gap-3">
            {product.reviews?.map((r, i) => (
              <div key={i} className="bg-white rounded-2xl px-5 md:px-6 py-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                  <span className="font-bold text-charcoal text-[0.92rem]">{r.name}</span>
                <div className="flex justify-between items-start mb-1.5">
                  <span className="text-[0.8rem] text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map(i => <span key={i} className={`text-[0.85rem] ${i <= r.rating ? 'text-gold' : 'text-[#e0d6c8]'}`}>★</span>)}
                </div>
                <p className="text-[0.88rem] text-gray-500 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* MORE FROM AURELIA */}
        {(relatedLoading || related.length > 0) && (
          <div>
            <div className="text-center mb-9">
              <span className="text-[0.7rem] font-bold tracking-[4px] text-gold uppercase">You May Also Like</span>
              <h2 className="font-playfair text-2xl md:text-[1.8rem] font-bold mt-2 text-charcoal">More from Aurelia</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <ProductSkeletonCard key={i} />
                ))
              ) : (
                related.map(p => <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />)
              )}
            </div>
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
