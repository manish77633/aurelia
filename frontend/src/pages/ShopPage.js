import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

const CATEGORIES = ['All', 'Luxury Watches', 'Designer Bags', 'Premium Shoes', 'Exclusive Apparel'];
const COLORS = ['All', 'Black', 'White', 'Gold', 'Brown', 'Blue', 'Cream', 'Cognac', 'Navy'];
const SORTS = [
  { val: '', label: 'Latest' },
  { val: 'price_asc', label: 'Price: Low to High' },
  { val: 'price_desc', label: 'Price: High to Low' },
  { val: 'top_rated', label: 'Top Rated' },
];

export default function ShopPage() {
  const dispatch = useDispatch();
  const { list: products, loading } = useSelector((s) => s.products);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [color, setColor] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts({
      keyword: search,
      category: category === 'All' ? '' : category,
      color: color === 'All' ? '' : color,
      minPrice, maxPrice, sort,
    }));
  }, [dispatch, search, category, color, minPrice, maxPrice, sort]);

  const toggleFiltersMobile = () => setShowFiltersMobile(!showFiltersMobile);

  return (
    <div className="bg-[#FAFAFA] min-h-[80vh]">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-[#CFA052]/10 py-8 px-6 md:px-12 lg:pt-10">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-[0.65rem] md:text-[0.7rem] font-bold tracking-[4px] text-[#CFA052] uppercase block">Aurelia Luxe</span>
          <h1 className="font-playfair text-[2rem] md:text-[2.4rem] font-bold text-[#1A1A1A] mt-2 mb-5">The Collection</h1>

          {/* SEARCH BEHAVIOR */}
          <div className="relative max-w-[600px] flex gap-3">
            <div className="relative flex-grow">
              <SearchIcon sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 20 }} />
              <input
                className="w-full py-3 pr-3.5 pl-11 border-[1.5px] border-[#e8e0d6] rounded-xl font-inter text-[0.9rem] bg-[#FAFAFA] outline-none transition-colors duration-200 focus:border-[#CFA052]"
                placeholder="Search luxury items..."
                value={search} onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* MOBILE FILTER BUTTON */}
            <button className="lg:hidden flex shrink-0 items-center justify-center p-3 border-[1.5px] border-[#e8e0d6] rounded-xl bg-white text-charcoal active:bg-gray-100" onClick={toggleFiltersMobile}>
              <TuneIcon sx={{ fontSize: 22, color: showFiltersMobile ? '#CFA052' : '#6B7280' }} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto py-8 px-6 md:px-12 flex flex-col lg:grid lg:grid-cols-[260px_1fr] gap-8">

        {/* ── SIDEBAR FILTERS ─── */}
        <aside className={`${showFiltersMobile ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] lg:sticky lg:top-[90px]">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f0ebe3]">
              <TuneIcon sx={{ fontSize: 18, color: '#CFA052' }} />
              <span className="font-playfair font-semibold text-base">Filters</span>
            </div>

            {/* Category */}
            <div className="mb-7">
              <div className="text-[0.7rem] font-bold tracking-[2px] text-[#CFA052] uppercase mb-3">Category</div>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`block w-full text-left bg-transparent border-none py-2 text-[0.88rem] cursor-pointer transition-all duration-200 mb-1 rounded-sm pl-2 ${category === c ? 'font-bold text-[#CFA052] border-l-2 border-l-[#CFA052]' : 'font-normal text-gray-500 border-l-2 border-l-transparent'}`}>
                  {c}
                </button>
              ))}
            </div>

            {/* Color */}
            <div className="mb-7">
              <div className="text-[0.7rem] font-bold tracking-[2px] text-[#CFA052] uppercase mb-3">Color</div>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)}
                    className={`px-3 py-1.5 rounded-full border-[1.5px] text-[0.78rem] font-semibold cursor-pointer transition-all duration-200 ${color === c ? 'border-[#CFA052] bg-[#CFA052] text-white' : 'border-[#e8e0d6] bg-white text-gray-500 hover:border-gray-300'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-7">
              <div className="text-[0.7rem] font-bold tracking-[2px] text-[#CFA052] uppercase mb-3">Price Range ($)</div>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={e => setMinPrice(e.target.value)}
                  className="w-1/2 px-2.5 py-2 border-[1.5px] border-[#e8e0d6] rounded-lg text-[0.85rem] outline-none font-inter focus:border-[#CFA052] transition-colors" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={e => setMaxPrice(e.target.value)}
                  className="w-1/2 px-2.5 py-2 border-[1.5px] border-[#e8e0d6] rounded-lg text-[0.85rem] outline-none font-inter focus:border-[#CFA052] transition-colors" />
              </div>
            </div>

            {/* Reset */}
            <button onClick={() => { setCategory('All'); setColor('All'); setMinPrice(''); setMaxPrice(''); setSearch(''); setSort(''); }}
              className="w-full bg-transparent border-[1.5px] border-[#e8e0d6] rounded-lg py-2.5 text-[0.82rem] font-semibold text-gray-500 cursor-pointer transition-all duration-200 hover:border-[#CFA052] hover:text-[#CFA052]">
              Reset Filters
            </button>
          </div>
        </aside>

        {/* ── PRODUCT GRID ─── */}
        <div>
          {/* Sort + count bar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[0.85rem] text-gray-500">{products.length} items found</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2 border-[1.5px] border-[#e8e0d6] rounded-lg text-[0.85rem] font-inter text-[#1A1A1A] bg-white outline-none cursor-pointer focus:border-[#CFA052] transition-colors">
              {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
            </select>
          </div>

          {loading ? <Loader /> : products.length === 0 ? (
            <div className="text-center py-20 px-5 bg-white rounded-2xl border border-[#FAFAFA]">
              <div className="text-5xl opacity-20 mb-4">🔍</div>
              <div className="font-playfair text-xl md:text-2xl font-bold mb-2 text-[#1A1A1A]">No items found</div>
              <div className="text-[0.9rem] text-gray-500">Try adjusting your filters or search.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
