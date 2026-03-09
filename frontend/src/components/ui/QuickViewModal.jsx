import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '../../slices/cartSlice';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import StarIcon from '@mui/icons-material/Star';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

export default function QuickViewModal({ product, onClose }) {
	const [qty, setQty] = useState(1);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user } = useSelector(s => s.auth);

	if (!product) return null;

	const handleAddToCart = () => {
		if (!user) { navigate('/login'); return; }
		dispatch(addToCart({ productId: product._id, qty }));
		toast.success(`${qty} ${product.name} added to cart`);
		onClose();
	};

	const imgSrc = product.image?.startsWith('/uploads')
		? `${process.env.REACT_APP_API_URL.replace('/api', '')}${product.image}`
		: product.image;

	return (
		<div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[2000] flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
			<div
				className="bg-white w-full max-w-[950px] rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]"
				onClick={e => e.stopPropagation()}
			>
				<button onClick={onClose} className="absolute top-5 right-5 z-20 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-lg hover:bg-gold hover:text-white transition-all duration-300">
					<CloseIcon sx={{ fontSize: 20 }} />
				</button>

				{/* Image Grid */}
				<div className="md:w-1/2 h-[350px] md:h-full bg-[#f5ede0] overflow-hidden">
					<img src={imgSrc} alt={product.name} className="w-full h-full object-cover" />
				</div>

				{/* Details */}
				<div className="md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar">
					<div className="text-[0.7rem] font-bold tracking-[3px] text-gold uppercase mb-3">{product.category}</div>
					<h2 className="font-playfair text-3xl md:text-4xl font-bold text-charcoal mb-4 leading-tight">{product.name}</h2>

					<div className="flex items-center gap-2 mb-6">
						<div className="flex text-gold">
							{[...Array(5)].map((_, i) => (
								<StarIcon key={i} sx={{ fontSize: 16, color: i < Math.floor(product.rating || 0) ? '#CFA052' : '#E5E7EB' }} />
							))}
						</div>
						<span className="text-[0.9rem] font-semibold">{(product.rating || 0).toFixed(1)}</span>
						<span className="text-gray-400 text-sm">({product.numReviews} Reviews)</span>
					</div>

					<div className="font-playfair text-3xl font-bold text-charcoal mb-8">${product.price.toLocaleString()}</div>

					<p className="text-gray-600 text-[0.95rem] leading-relaxed mb-8 line-clamp-3">
						{product.description}
					</p>

					<div className="space-y-6">
						<div className="flex items-center gap-6">
							<div className="flex items-center border-[1.5px] border-[#e8e0d6] rounded-xl h-14 overflow-hidden">
								<button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors">
									<RemoveIcon sx={{ fontSize: 16 }} />
								</button>
								<span className="w-10 text-center font-bold font-inter">{qty}</span>
								<button onClick={() => setQty(Math.min(product.countInStock, qty + 1))} className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors">
									<AddIcon sx={{ fontSize: 16 }} />
								</button>
							</div>
							<div className="text-[0.8rem] text-gray-400 font-medium">
								{product.countInStock > 0 ? (
									<span className="text-emerald-500 font-bold">In Stock</span>
								) : (
									<span className="text-rose-500 font-bold">Out of Stock</span>
								)}
							</div>
						</div>

						<div className="flex gap-4">
							<button
								onClick={handleAddToCart}
								disabled={product.countInStock === 0}
								className="flex-1 h-14 bg-charcoal text-white rounded-xl font-bold uppercase tracking-[2px] text-[0.85rem] flex items-center justify-center gap-2 hover:bg-gold transition-all duration-300 shadow-xl shadow-charcoal/10"
							>
								<ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />
								Add to Cart
							</button>
						</div>

						<button
							onClick={() => navigate(`/product/${product._id}`)}
							className="w-full text-[0.8rem] font-bold text-gold uppercase tracking-[2px] hover:underline"
						>
							View Full Details
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
