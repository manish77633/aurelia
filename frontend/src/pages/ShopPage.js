import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import ProductCard from '../components/ui/ProductCard';
import Loader from '../components/ui/Loader';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import QuickViewModal from '../components/ui/QuickViewModal';
import { useLocation, useNavigate } from 'react-router-dom';

const CATEGORIES = ['All', 'Apparel', 'Footwear', 'Accessories'];
const SUB_CATEGORIES = {
  'Apparel': ['Shirt', 'T-shirt', 'Coat'],
  'Footwear': ['Sport Shoe', 'Boot'],
  'Accessories': ['Watch', 'Bag']
};
const COLORS = ['All', 'Black', 'White', 'Gold', 'Brown', 'Blue', 'Cream', 'Cognac', 'Navy', 'Silver', 'Charcoal', 'Camel'];
const SORTS = [
  { val: '', label: 'Latest' },
  { val: 'price_asc', label: 'Price: Low to High' },
  { val: 'price_desc', label: 'Price: High to Low' },
  { val: 'top_rated', label: 'Top Rated' },
];

export default function ShopPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { list: products, loading, page, pages, total } = useSelector((s) => s.products);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [color, setColor] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Consolidated effect for fetching and resetting
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genderParam = params.get('gender') || '';
    const subCatParam = params.get('subCategory') || '';
    const keywordParam = params.get('keyword') || '';
    const isNavbarNav = !!(genderParam || subCatParam);

    // If keyword is in URL, sync it to local state for UX consistency
    if (keywordParam && keywordParam !== search) {
      setSearch(keywordParam);
    }

    const effectiveSearch = keywordParam || (isNavbarNav ? '' : search);
    const effectiveCategory = (subCatParam || genderParam) ? '' : (category === 'All' ? '' : category);

    // Fetch products
    dispatch(fetchProducts({
      keyword: effectiveSearch,
      category: effectiveCategory,
      color: color === 'All' ? '' : color,
      minPrice,
      maxPrice,
      sort,
      gender: genderParam,
      subCategory: subCatParam,
      page: currentPage,
      limit: 12
    }));
  }, [dispatch, location.search, search, category, color, minPrice, maxPrice, sort, currentPage]);

  // Handle local filter resets on URL change (Navbar clicks)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    // If the user navigates to /shop with NO params, or with gender/subCat, reset local filters.
    // This covers "Full Collection" click and direct Navbar link clicks.
    if (!location.search || params.get('gender') || params.get('subCategory')) {
      setSearch('');
      setCategory('All');
      setColor('All');
      setMinPrice('');
      setMaxPrice('');
      setSort('');
      setCurrentPage(1);
    }
  }, [location.search]);

  const toggleFiltersMobile = () => setShowFiltersMobile(!showFiltersMobile);

  const loadMore = () => {
    if (currentPage < pages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (category !== 'All') count++;
    if (color !== 'All') count++;
    if (minPrice || maxPrice) count++;
    const params = new URLSearchParams(location.search);
    if (params.get('gender')) count++;
    if (params.get('subCategory')) count++;
    return count;
  };

  const genderName = new URLSearchParams(location.search).get('gender');
  const subCatName = new URLSearchParams(location.search).get('subCategory');

  return (
    <div className="bg-[#FAFAFA] min-h-[80vh]">
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-[#CFA052]/10 py-8 px-6 md:px-12 lg:pt-10">
        <div className="max-w-[1280px] mx-auto">
          <span className="text-[0.65rem] md:text-[0.7rem] font-bold tracking-[4px] text-[#CFA052] uppercase block">Aurelia Luxe</span>
          <h1 className="font-playfair text-[2rem] md:text-[2.4rem] font-bold text-[#1A1A1A] mt-2 mb-5">
            {subCatName
              ? (subCatName.toLowerCase().includes('watch') ? `${subCatName}es` : `${subCatName}s`)
              : genderName ? `${genderName}'s Collection` : 'The Collection'}
          </h1>

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
              <TuneIcon sx={{ fontSize: 22, color: getActiveFiltersCount() > 0 ? '#CFA052' : '#6B7280' }} />
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
              {getActiveFiltersCount() > 0 && <span className="ml-auto bg-gold text-white text-[0.6rem] font-bold px-1.5 py-0.5 rounded-md">{getActiveFiltersCount()}</span>}
            </div>

            {/* Category */}
            <div className="mb-7">
              <div className="text-[0.7rem] font-bold tracking-[2px] text-[#CFA052] uppercase mb-3">Category</div>
              {CATEGORIES.map(c => {
                const isActive = category === c;
                return (
                  <div key={c} className="mb-1">
                    <button onClick={() => {
                      setCategory(c);
                      // Clear subCategory and gender when switching broad categories manually
                      if (subCatName || genderName) {
                        navigate('/shop');
                      }
                    }}
                      className={`block w-full text-left bg-transparent border-none py-2 text-[0.88rem] cursor-pointer transition-all duration-200 pl-2 ${isActive ? 'font-bold text-[#CFA052] border-l-2 border-l-[#CFA052]' : 'font-normal text-gray-500 border-l-2 border-l-transparent'}`}>
                      {c}
                    </button>
                    {/* Sub-categories */}
                    {isActive && SUB_CATEGORIES[c] && (
                      <div className="ml-4 mt-1 flex flex-col gap-1 border-l border-gold/10">
                        {SUB_CATEGORIES[c].map(sub => {
                          // Check if any gender-prefixed subcategory matches
                          const isSubActive = subCatName === `Men ${sub}` || subCatName === `Women ${sub}` || subCatName === sub;
                          return (
                            <button
                              key={sub}
                              onClick={() => {
                                // Default to Women if not specified, or match current gender
                                const targetGender = genderName || 'Women';
                                navigate(`/shop?gender=${targetGender}&subCategory=${targetGender} ${sub}`);
                              }}
                              className={`text-left py-1.5 pl-3 text-[0.82rem] transition-colors cursor-pointer ${isSubActive ? 'text-gold font-semibold' : 'text-gray-400 hover:text-gold'}`}
                            >
                              {sub}s
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
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
            <span className="text-[0.85rem] text-gray-500">{total || products.length} items found</span>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2 border-[1.5px] border-[#e8e0d6] rounded-lg text-[0.85rem] font-inter text-[#1A1A1A] bg-white outline-none cursor-pointer focus:border-[#CFA052] transition-colors">
              {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>

          {loading && <div className="mt-10"><Loader /></div>}

          {!loading && pages > currentPage && (
            <div className="text-center mt-12 mb-20">
              <button
                onClick={loadMore}
                className="btn-gold px-12 py-4"
              >
                Load More Products
              </button>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20 px-5 bg-white rounded-2xl border border-[#FAFAFA]">
              <div className="text-5xl opacity-20 mb-4">🔍</div>
              <div className="font-playfair text-xl md:text-2xl font-bold mb-2 text-[#1A1A1A]">No items found</div>
              <div className="text-[0.9rem] text-gray-500">Try adjusting your filters or search.</div>
            </div>
          )}

          {!loading && products.length > 0 && currentPage === pages && (
            <div className="text-center mt-12 mb-20 text-gray-400 text-sm font-medium italic">
              — You've reached the end of the collection —
            </div>
          )}
        </div>
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
