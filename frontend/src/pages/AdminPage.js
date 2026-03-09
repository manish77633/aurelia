import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import LinkIcon from '@mui/icons-material/Link';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const TABS = ['Dashboard', 'Products', 'Orders', 'Users'];
const CATS = ['Apparel', 'Footwear', 'Accessories'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const SUB_CATS = [
  'Men Shirt', 'Men T-shirt', 'Men Coat', 'Men Sport Shoe', 'Men Boot', 'Men Watch', 'Men Bag',
  'Women Shirt', 'Women T-shirt', 'Women Coat', 'Women Sport Shoe', 'Women Boot', 'Women Watch', 'Women Bag'
];

const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'Apparel',
  subCategory: '',
  gender: 'Men',
  colors: '',
  countInStock: '',
  featured: false
};

export default function AdminPage() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;
  const headers = { Authorization: `Bearer ${user?.token}` };

  const [tab, setTab] = useState('Dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  // Multi-image state
  const [imageFiles, setImageFiles] = useState([]); // File objects for upload
  const [imagePreviews, setImagePreviews] = useState([]); // { src, type:'file'|'url', file?:File, url?:string }
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [urlInput, setUrlInput] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [loading, setLoading] = useState(false);
  const [descLoading, setDescLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminSearch, setAdminSearch] = useState('');
  const itemsPerPage = 12;
  const fileRef = useRef();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchStats(); fetchProducts(); fetchOrders(); fetchUsers();
  }, []);

  const fetchStats = async () => {
    try { const { data } = await axios.get(`${API}/admin/stats`, { headers }); setStats(data); } catch { }
  };
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${API}/products?limit=1000`, { headers });
      setProducts(Array.isArray(data) ? data : (data.products || []));
    } catch { }
  };
  const fetchOrders = async () => {
    try { const { data } = await axios.get(`${API}/orders`, { headers }); setOrders(data); } catch { }
  };
  const fetchUsers = async () => {
    try { const { data } = await axios.get(`${API}/admin/users`, { headers }); setUsers(data); } catch { }
  };

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    if (Object.keys(stats).length === 0) fetchStats();
    if (products.length === 0) fetchProducts();
    if (orders.length === 0) fetchOrders();
    if (users.length === 0) fetchUsers();
    setCurrentPage(1); // Reset page on tab change
    setAdminSearch(''); // Reset search on tab change
  }, [tab]);

  // ── Multi-image helpers ──────────────────────────────────────
  const addFiles = useCallback((files) => {
    const newPreviews = [];
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => {
          if (prev.length >= 10) { toast.warning('Max 10 images'); return prev; }
          return [...prev, { src: reader.result, type: 'file', file }];
        });
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) addFiles(e.target.files);
    e.target.value = '';
  };

  const addUrlImage = () => {
    const url = urlInput.trim();
    if (!url) return;
    if (imagePreviews.length >= 10) { toast.warning('Max 10 images'); return; }
    setImagePreviews(prev => [...prev, { src: url, type: 'url', url }]);
    setUrlInput('');
  };

  const removeImage = (idx) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    setMainImageIndex(prev => {
      if (idx === prev) return 0;
      if (idx < prev) return prev - 1;
      return prev;
    });
  };

  // Drag to reorder
  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e, idx) => { e.preventDefault(); };
  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) return;
    setImagePreviews(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(dropIdx, 0, moved);
      return arr;
    });
    // Update mainImageIndex if it was affected
    setMainImageIndex(prev => {
      if (prev === dragIdx) return dropIdx;
      if (dragIdx < prev && dropIdx >= prev) return prev - 1;
      if (dragIdx > prev && dropIdx <= prev) return prev + 1;
      return prev;
    });
    setDragIdx(null);
  };

  // Drop zone handlers
  const onDropZone = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
  };
  const onDragEnter = (e) => { e.preventDefault(); setIsDraggingOver(true); };
  const onDragLeave = (e) => { e.preventDefault(); setIsDraggingOver(false); };

  const resetForm = () => {
    setForm(EMPTY_FORM); setEditId(null);
    setImagePreviews([]); setMainImageIndex(0);
    setUrlInput(''); setImageFiles([]);
  };

  const handleGenerateDesc = async () => {
    if (!form.name) { toast.error('Enter a product name first'); return; }
    setDescLoading(true);
    try {
      const { data } = await axios.post(`${API}/admin/generate-description`,
        { productName: form.name, category: form.category },
        { headers });
      setForm(f => ({ ...f, description: data.description }));
      toast.success('✨ Description generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI generation failed. Check your GEMINI_API_KEY.');
    }
    setDescLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) { toast.error('Name, price, category required'); return; }
    if (imagePreviews.length === 0 && !editId) { toast.error('Please add at least one image'); return; }
    setLoading(true);
    try {
      const hasFiles = imagePreviews.some(p => p.type === 'file');
      const urlImages = imagePreviews.filter(p => p.type === 'url').map(p => p.url);
      const existingImgs = imagePreviews.filter(p => p.type === 'existing').map(p => p.url);

      let payload;
      let config;

      if (hasFiles) {
        payload = new FormData();
        Object.entries(form).forEach(([k, v]) => payload.append(k, v));
        // Append file images in order
        imagePreviews.forEach(p => {
          if (p.type === 'file' && p.file) payload.append('images', p.file);
        });
        if (urlImages.length > 0) payload.append('imageUrls', JSON.stringify(urlImages));
        if (existingImgs.length > 0) payload.append('existingImages', JSON.stringify(existingImgs));
        payload.append('mainImageIndex', String(mainImageIndex));
        config = { headers: { ...headers, 'Content-Type': 'multipart/form-data' } };
      } else {
        payload = {
          ...form,
          imageUrls: JSON.stringify(urlImages),
          existingImages: JSON.stringify(existingImgs),
          mainImageIndex: String(mainImageIndex),
        };
        config = { headers: { ...headers, 'Content-Type': 'application/json' } };
      }

      if (editId) {
        await axios.put(`${API}/products/${editId}`, payload, config);
        toast.success('Product updated ✨');
      } else {
        await axios.post(`${API}/products`, payload, config);
        toast.success('Product added 🎉');
      }
      resetForm(); fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setLoading(false);
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      subCategory: p.subCategory || '',
      gender: p.gender || 'Men',
      colors: (p.colors || []).join(', '),
      countInStock: p.countInStock,
      featured: p.featured
    });
    // Load existing images
    const imgs = (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : []);
    const previews = imgs.map(url => ({
      src: url.startsWith('/uploads') ? `${API.replace('/api', '')}${url}` : url,
      type: 'existing',
      url,
    }));
    setImagePreviews(previews);
    const mi = imgs.indexOf(p.image);
    setMainImageIndex(mi >= 0 ? mi : 0);
    setEditId(p._id);
    setTab('Products'); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await axios.delete(`${API}/products/${id}`, { headers });
    toast.info('Product deleted'); fetchProducts();
  };

  const updateOrderStatus = async (id, status) => {
    try { await axios.put(`${API}/orders/${id}/status`, { status }, { headers }); toast.success('Status updated'); fetchOrders(); } catch { }
  };

  const updateUserRole = async (id, role) => {
    try { await axios.put(`${API}/admin/users/${id}`, { role }, { headers }); toast.success('Role updated'); fetchUsers(); } catch { }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete user?')) return;
    await axios.delete(`${API}/admin/users/${id}`, { headers }); fetchUsers();
  };

  const inp = "w-full px-3.5 py-2.5 border-[1.5px] border-[#e8e0d6] rounded-[10px] font-inter text-[0.9rem] bg-[#FAFAFA] outline-none text-[#1A1A1A] focus:border-[#CFA052] transition-colors";
  const lbl = "text-[0.72rem] font-bold text-[#6B7280] block mb-1.5 tracking-[1px] uppercase";

  const statusColors = (status) => {
    if (status === 'Delivered') return { bg: '#dcfce7', color: '#166534' };
    if (status === 'Shipped') return { bg: '#dbeafe', color: '#1d4ed8' };
    if (status === 'Confirmed') return { bg: '#e0f2fe', color: '#0369a1' };
    if (status === 'Out for Delivery') return { bg: '#f3e8ff', color: '#7c3aed' };
    if (status === 'Cancelled') return { bg: '#fef2f2', color: '#b91c1c' };
    return { bg: '#fef9ec', color: '#92400e' };
  };

  const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  return (
    <div className="bg-[#FAFAFA] min-h-screen">

      {/* HEADER */}
      <div className="bg-white border-b border-[rgba(207,160,82,0.12)] px-4 sm:px-8 md:px-12 py-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex items-center gap-2.5">
          <DiamondOutlinedIcon sx={{ color: '#CFA052', fontSize: 22 }} />
          <div>
            <div className="font-playfair text-xl font-bold text-[#1A1A1A]">Admin Console</div>
            <div className="text-[0.78rem] text-[#9CA3AF]">Aurelia Luxe Management</div>
          </div>
        </div>

        {/* GLOBAL ADMIN SEARCH */}
        <div className="relative flex-grow max-w-[400px] hidden lg:block mx-8">
          <SearchIcon sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: 18 }} />
          <input
            className="w-full py-2.5 pr-4 pl-10 border border-[#e8e0d6] rounded-xl font-inter text-[0.85rem] bg-[#FAFAFA] outline-none transition-all focus:border-[#CFA052] focus:bg-white focus:shadow-sm"
            placeholder={`Search ${tab === 'Dashboard' ? 'everything' : tab.toLowerCase()}...`}
            value={adminSearch}
            onChange={e => setAdminSearch(e.target.value)}
          />
        </div>

        {/* TABS — scrollable on mobile */}
        <div className="flex gap-1 bg-[#f5f0e8] rounded-xl p-1 overflow-x-auto w-full sm:w-auto flex-shrink-0">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-3 sm:px-5 py-2 rounded-lg border-none font-inter text-[0.82rem] sm:text-[0.85rem] font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap flex-shrink-0"
              style={{
                background: tab === t ? '#CFA052' : 'transparent',
                color: tab === t ? '#fff' : '#6B7280',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 md:px-12 py-8">

        {/* ── DASHBOARD ───────────────────────────── */}
        {tab === 'Dashboard' && (
          <div>
            <h2 className="font-playfair text-2xl font-bold mb-7">Overview</h2>
            {/* Stats grid - 2 cols on mobile, 4 on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { Icon: PeopleOutlineIcon, label: 'Total Users', value: stats.totalUsers || 0, color: '#6366f1', target: 'Users' },
                { Icon: InventoryOutlinedIcon, label: 'Products', value: stats.totalProducts || 0, color: '#CFA052', target: 'Products' },
                { Icon: ShoppingBagOutlinedIcon, label: 'Orders', value: stats.totalOrders || 0, color: '#10b981', target: 'Orders' },
                { Icon: AttachMoneyIcon, label: 'Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, color: '#f59e0b', target: 'Dashboard', subtitle: stats.codPendingRevenue ? `+$${stats.codPendingRevenue.toLocaleString()} COD pending` : null },
              ].map(({ Icon, label, value, color, target, subtitle }) => (
                <div
                  key={label}
                  onClick={() => setTab(target)}
                  className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[rgba(207,160,82,0.08)] transition-transform duration-200 hover:-translate-y-1"
                  style={{ cursor: target === 'Dashboard' ? 'default' : 'pointer' }}
                >
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${color}15` }}>
                    <Icon sx={{ fontSize: 20, color }} />
                  </div>
                  <div className="font-playfair text-2xl sm:text-3xl font-bold text-[#1A1A1A] break-all">{value}</div>
                  <div className="text-[0.78rem] text-[#9CA3AF] mt-1">{label}</div>
                  {subtitle && <div className="text-[0.65rem] text-[#CFA052] font-semibold mt-0.5">{subtitle}</div>}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Sales Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] h-[350px]">
                <div className="flex justify-between items-center mb-6">
                  <div className="font-playfair text-lg font-bold">Revenue Analytics</div>
                  <div className="text-[0.65rem] font-bold text-gold uppercase tracking-widest">Last 7 Days</div>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={stats.dailyRevenue || []}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#CFA052" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#CFA052" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} tickFormatter={v => `$${v}`} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                    <Area type="monotone" dataKey="total" stroke="#CFA052" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Low Stock Alerts */}
              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <div className="font-playfair text-lg font-bold">Stock Alerts</div>
                  <ErrorOutlineIcon sx={{ color: '#f87171', fontSize: 20 }} />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {products.filter(p => p.countInStock <= 5).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#9CA3AF]">
                      <CheckCircleOutlinedIcon sx={{ fontSize: 40, mb: 1, opacity: 0.2 }} />
                      <div className="text-[0.8rem]">All stock levels healthy</div>
                    </div>
                  ) : (
                    products.filter(p => p.countInStock <= 5).map(p => (
                      <div key={p._id} className="flex items-center gap-3 p-3 mb-2 bg-red-50/50 rounded-xl border border-red-100/50">
                        <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <div className="text-[0.78rem] font-bold text-charcoal truncate">{p.name}</div>
                          <div className="text-[0.68rem] text-red-500 font-bold">{p.countInStock} units left</div>
                        </div>
                        <button onClick={() => { setTab('Products'); handleEdit(p); }} className="text-[0.65rem] font-bold text-gold hover:underline uppercase">Restock</button>
                      </div>
                    ))
                  )}
                </div>
                {products.filter(p => p.countInStock <= 5).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-50 text-center">
                    <span className="text-[0.65rem] text-[#9CA3AF] font-medium italic">Monitor closely to avoid stockouts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <div className="font-playfair text-lg font-bold mb-5">Recent Orders</div>
              <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
                <table className="w-full border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#f0ebe3]">
                      {['Order ID', 'Customer', 'Total', 'Status', 'Date'].map(h => (
                        <th key={h} className="text-left py-2.5 px-3 text-[0.72rem] font-bold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 6).map(o => {
                      const sc = statusColors(o.status);
                      return (
                        <tr key={o._id} className="border-b border-[#f8f5f0]">
                          <td className="py-3 px-3 text-[0.8rem] text-[#9CA3AF]">#{o._id?.slice(-6)}</td>
                          <td className="py-3 px-3 text-[0.85rem] font-semibold">{o.user?.name || '—'}</td>
                          <td className="py-3 px-3 text-[0.85rem] font-bold text-[#CFA052]">${o.totalPrice?.toFixed(2)}</td>
                          <td className="py-3 px-3">
                            <span className="px-3 py-1 rounded-full text-[0.72rem] font-bold" style={{ background: sc.bg, color: sc.color }}>
                              {o.status || 'Processing'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[0.8rem] text-[#9CA3AF]">{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── PRODUCTS ────────────────────────────── */}
        {tab === 'Products' && (
          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-7">
            {/* FORM */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] h-fit lg:sticky lg:top-[90px]">
              <div className="font-playfair text-lg font-bold mb-6 pb-4 border-b border-[#f0ebe3] flex justify-between items-center">
                {editId ? '✏️ Edit Product' : '+ Add New Product'}
                {editId && <button onClick={resetForm} className="bg-none border-none text-[0.8rem] text-[#9CA3AF] cursor-pointer hover:text-red-400 transition-colors">Cancel</button>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {[
                  { key: 'name', lbl: 'Product Name', type: 'text', ph: 'Chronos Imperial Gold' },
                  { key: 'price', lbl: 'Price ($)', type: 'number', ph: '4200' },
                  { key: 'colors', lbl: 'Colors (comma-separated)', type: 'text', ph: 'Gold, Black, Silver' },
                  { key: 'countInStock', lbl: 'Stock Qty', type: 'number', ph: '10' },
                ].map(({ key, lbl: l, type, ph }) => (
                  <div key={key}>
                    <label className={lbl}>{l}</label>
                    <input type={type} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} className={inp} />
                  </div>
                ))}

                {/* Category */}
                <div>
                  <label className={lbl}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={`${inp} cursor-pointer`}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className={lbl}>Gender</label>
                  <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className={`${inp} cursor-pointer`}>
                    {GENDERS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>

                {/* Sub-Category */}
                <div>
                  <label className={lbl}>Sub-Category</label>
                  <select value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })} className={`${inp} cursor-pointer`}>
                    <option value="">None</option>
                    {SUB_CATS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className={lbl} style={{ margin: 0 }}>Description</label>
                    <button
                      onClick={handleGenerateDesc}
                      disabled={descLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[0.72rem] font-bold cursor-pointer border-none transition-all duration-200"
                      style={{
                        background: descLoading ? '#f5f0e8' : 'linear-gradient(135deg, #CFA052, #E8C97A)',
                        color: descLoading ? '#9CA3AF' : '#fff',
                        boxShadow: descLoading ? 'none' : '0 2px 12px rgba(207,160,82,0.35)',
                      }}
                      title="Auto-generate with AI"
                    >
                      {descLoading
                        ? <><span style={{ display: 'inline-block', width: 12, height: 12, border: '2px solid #CFA052', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} /> Generating...</>
                        : <><AutoFixHighIcon sx={{ fontSize: 14 }} /> ✨ Auto-Generate</>}
                    </button>
                  </div>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Luxury product description..." className={`${inp} resize-vertical`} />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="my-4 flex items-center justify-between px-3.5 py-3 bg-[#FAFAFA] rounded-xl border-[1.5px] border-[#e8e0d6]">
                <span className="text-[0.85rem] font-semibold">Featured Product</span>
                <button
                  onClick={() => setForm({ ...form, featured: !form.featured })}
                  className="relative border-none cursor-pointer transition-all duration-200"
                  style={{ width: 44, height: 24, borderRadius: 12, background: form.featured ? '#CFA052' : '#d1d5db' }}
                >
                  <span
                    className="absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200 shadow-sm"
                    style={{ left: form.featured ? 22 : 3 }}
                  />
                </button>
              </div>

              {/* ── MULTI-IMAGE SECTION ────────────────── */}
              <div className="mb-4">
                <label className={lbl}>Product Images <span className="text-[#9CA3AF] font-normal normal-case tracking-normal">(up to 10, ★ = main)</span></label>

                {/* Drop zone */}
                <div
                  onDrop={onDropZone}
                  onDragOver={(e) => e.preventDefault()}
                  onDragEnter={onDragEnter}
                  onDragLeave={onDragLeave}
                  onClick={() => fileRef.current.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all duration-300 mb-3 ${isDraggingOver
                    ? 'border-[#CFA052] bg-[#fef9ec] scale-[1.01]'
                    : 'border-[#e8e0d6] bg-[#FAFAFA] hover:border-[#CFA052]'
                    }`}
                >
                  <CloudUploadOutlinedIcon sx={{ fontSize: 28, color: isDraggingOver ? '#CFA052' : '#9CA3AF' }} />
                  <div className="text-[0.82rem] font-semibold text-[#6B7280] mt-1.5">Drag & drop images here or click to browse</div>
                  <div className="text-[0.72rem] text-[#9CA3AF] mt-0.5">PNG, JPG, WEBP • Max 10 images</div>
                  <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                </div>

                {/* URL input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Or paste image URL..."
                    value={urlInput}
                    onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addUrlImage()}
                    className={`${inp} flex-1`}
                  />
                  <button
                    onClick={addUrlImage}
                    className="px-3 py-2 bg-[#f5f0e8] border-[1.5px] border-[#e8e0d6] rounded-[10px] font-inter text-[0.8rem] font-bold text-[#CFA052] cursor-pointer hover:bg-[#CFA052] hover:text-white hover:border-[#CFA052] transition-all duration-200"
                  >
                    <LinkIcon sx={{ fontSize: 16 }} />
                  </button>
                </div>

                {/* Image grid */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2">
                    {imagePreviews.map((img, idx) => (
                      <div
                        key={idx}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={(e) => handleDrop(e, idx)}
                        className={`relative group rounded-xl overflow-hidden aspect-square bg-[#f5ede0] border-2 transition-all duration-200 cursor-grab active:cursor-grabbing ${mainImageIndex === idx
                          ? 'border-[#CFA052] shadow-[0_0_0_2px_rgba(207,160,82,0.3)]'
                          : 'border-transparent hover:border-[#e8e0d6]'
                          }`}
                      >
                        <img src={img.src} alt={`preview-${idx}`} className="w-full h-full object-cover" onError={e => e.target.style.opacity = '0.3'} />

                        {/* Drag handle */}
                        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DragIndicatorIcon sx={{ fontSize: 16, color: '#fff', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                        </div>

                        {/* Main image star */}
                        <button
                          onClick={(e) => { e.stopPropagation(); setMainImageIndex(idx); }}
                          className="absolute top-1 right-1 bg-black/40 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#CFA052]"
                          title={mainImageIndex === idx ? 'Main image' : 'Set as main image'}
                        >
                          {mainImageIndex === idx
                            ? <StarIcon sx={{ fontSize: 14, color: '#FFD700' }} />
                            : <StarBorderIcon sx={{ fontSize: 14, color: '#fff' }} />
                          }
                        </button>

                        {/* Remove button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                          className="absolute bottom-1 right-1 bg-red-500/80 backdrop-blur-sm rounded-full w-5 h-5 flex items-center justify-center border-none cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600"
                        >
                          <CloseIcon sx={{ fontSize: 12, color: '#fff' }} />
                        </button>

                        {/* Main badge */}
                        {mainImageIndex === idx && (
                          <div className="absolute bottom-1 left-1 bg-[#CFA052] text-white text-[0.55rem] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-wide">Main</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="text-[0.72rem] text-[#9CA3AF] mt-2 text-center">
                    {imagePreviews.length}/10 images • Drag to reorder • ★ Star to set main image
                  </div>
                )}
              </div>

              <button className="btn-gold w-full py-3.5 text-[0.92rem] mt-1" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>
            </div>

            {/* PRODUCT LIST */}
            <div>
              <div className="font-playfair text-xl font-bold mb-5">
                {adminSearch ? `Results for "${adminSearch}"` : `${products.length} Products`}
              </div>
              <div className="flex flex-col gap-3">
                {(() => {
                  const filteredProducts = products.filter(p =>
                    p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                    p.category.toLowerCase().includes(adminSearch.toLowerCase()) ||
                    p.subCategory?.toLowerCase().includes(adminSearch.toLowerCase())
                  );
                  const sortedProducts = [...filteredProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  const indexOfLastProduct = currentPage * itemsPerPage;
                  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
                  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
                  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

                  return (
                    <>
                      {currentProducts.map(p => (
                        <div
                          key={p._id}
                          className="bg-white rounded-2xl px-4 py-3.5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex items-center gap-3.5 transition-all duration-200"
                          style={{ border: editId === p._id ? '1.5px solid #CFA052' : '1.5px solid transparent' }}
                        >
                          <img
                            src={p.image?.startsWith('/uploads') ? `${API.replace('/api', '')}${p.image}` : p.image}
                            alt={p.name}
                            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover flex-shrink-0 bg-[#f5ede0]"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-[0.9rem] mb-0.5 truncate">{p.name}</div>
                            <div className="flex flex-wrap gap-2">
                              <span className="text-[0.75rem] text-[#9CA3AF]">{p.category}</span>
                              {p.featured && <span className="text-[0.65rem] bg-[#fef9ec] text-[#CFA052] font-bold px-2 py-0.5 rounded-full">FEATURED</span>}
                            </div>
                          </div>
                          <div className="font-playfair font-bold text-[#1A1A1A] flex-shrink-0 text-sm sm:text-base">${p.price?.toLocaleString()}</div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <button onClick={() => handleEdit(p)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-[1.5px] border-[#e8e0d6] bg-white cursor-pointer flex items-center justify-center hover:border-[#CFA052] transition-colors">
                              <EditOutlinedIcon sx={{ fontSize: 15, color: '#6B7280' }} />
                            </button>
                            <button onClick={() => handleDelete(p._id)} className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-[1.5px] border-[#fee2e2] bg-white cursor-pointer flex items-center justify-center hover:bg-red-50 transition-colors">
                              <DeleteOutlineIcon sx={{ fontSize: 15, color: '#f87171' }} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Premium Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8 mb-4">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-xl text-[0.8rem] font-bold transition-all duration-200 border-none cursor-pointer ${currentPage === 1 ? 'bg-gray-100 text-gray-400 opacity-50' : 'bg-white text-charcoal hover:bg-gold hover:text-white shadow-sm'}`}
                          >
                            Prev
                          </button>
                          {[...Array(totalPages)].map((_, i) => {
                            const pageNum = i + 1;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-10 h-10 rounded-xl text-[0.85rem] font-bold transition-all duration-200 border-none cursor-pointer ${currentPage === pageNum ? 'bg-gold text-white shadow-[0_4px_12px_rgba(207,160,82,0.3)]' : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'}`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-xl text-[0.8rem] font-bold transition-all duration-200 border-none cursor-pointer ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 opacity-50' : 'bg-white text-charcoal hover:bg-gold hover:text-white shadow-sm'}`}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ──────────────────────────────── */}
        {tab === 'Orders' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl font-bold">All Orders ({orders.length})</h2>
              {adminSearch && <span className="text-[0.85rem] text-gold font-semibold">Filtering by: {adminSearch}</span>}
            </div>

            {/* Mobile card view */}
            <div className="flex flex-col gap-4 lg:hidden">
              {orders
                .filter(o =>
                  o._id.toLowerCase().includes(adminSearch.toLowerCase()) ||
                  o.user?.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
                  o.status?.toLowerCase().includes(adminSearch.toLowerCase())
                )
                .map(o => {
                  const sc = statusColors(o.status);
                  return (
                    <div key={o._id} className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#f0ebe3]">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-[0.75rem] text-[#9CA3AF] font-medium">#{o._id?.slice(-6)}</div>
                          <div className="font-semibold text-[#1A1A1A]">{o.user?.name || '—'}</div>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[0.72rem] font-bold" style={{ background: sc.bg, color: sc.color }}>
                          {o.status || 'Processing'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-[0.85rem] text-[#6B7280]">{o.orderItems?.length} item(s) • {new Date(o.createdAt).toLocaleDateString()}</div>
                        <div className="font-bold text-[#CFA052]">${o.totalPrice?.toFixed(2)}</div>
                      </div>
                      <select
                        value={o.status || 'Processing'}
                        onChange={e => updateOrderStatus(o._id, e.target.value)}
                        className="w-full px-3 py-2 border-[1.5px] border-[#e8e0d6] rounded-xl text-[0.85rem] cursor-pointer font-inter bg-[#FAFAFA] outline-none focus:border-[#CFA052]"
                      >
                        {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  );
                })}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <table className="w-full border-collapse">
                <thead className="bg-[#f9f6f1]">
                  <tr>
                    {['Order', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-[0.72rem] font-bold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter(o =>
                      o._id.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      o.user?.name?.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      o.status?.toLowerCase().includes(adminSearch.toLowerCase())
                    )
                    .map(o => {
                      const sc = statusColors(o.status);
                      return (
                        <tr key={o._id} className="border-b border-[#f5f0e8]">
                          <td className="px-4 py-3.5 text-[0.8rem] text-[#9CA3AF]">#{o._id?.slice(-6)}</td>
                          <td className="px-4 py-3.5 text-[0.88rem] font-semibold">{o.user?.name}</td>
                          <td className="px-4 py-3.5 text-[0.88rem] text-[#6B7280]">{o.orderItems?.length}</td>
                          <td className="px-4 py-3.5 font-bold text-[#CFA052]">${o.totalPrice?.toFixed(2)}</td>
                          <td className="px-4 py-3.5">
                            <span className="px-3 py-1 rounded-full text-[0.72rem] font-bold" style={{ background: sc.bg, color: sc.color }}>
                              {o.status || 'Processing'}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-[0.8rem] text-[#9CA3AF]">{new Date(o.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3.5">
                            <select
                              value={o.status || 'Processing'}
                              onChange={e => updateOrderStatus(o._id, e.target.value)}
                              className="px-2.5 py-1.5 border-[1.5px] border-[#e8e0d6] rounded-lg text-[0.8rem] cursor-pointer font-inter bg-white outline-none"
                            >
                              {ORDER_STATUSES.map(s => <option key={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── USERS ───────────────────────────────── */}
        {tab === 'Users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-playfair text-2xl font-bold">All Users ({users.length})</h2>
              {adminSearch && <span className="text-[0.85rem] text-gold font-semibold">Filtering by: {adminSearch}</span>}
            </div>

            {/* Mobile card view */}
            <div className="flex flex-col gap-4 lg:hidden">
              {users
                .filter(u =>
                  u.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                  u.email.toLowerCase().includes(adminSearch.toLowerCase())
                )
                .map(u => (
                  <div
                    key={u._id}
                    className="bg-white rounded-2xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#f0ebe3] cursor-pointer hover:border-[rgba(207,160,82,0.3)] transition-colors"
                    onClick={() => setSelectedUser(u)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#f5ede0] flex items-center justify-center font-playfair font-bold text-[#CFA052]">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-[#1A1A1A] truncate">{u.name}</div>
                        <div className="text-[0.82rem] text-[#6B7280] truncate">{u.email}</div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[0.72rem] font-bold flex-shrink-0"
                        style={{ background: u.role === 'admin' ? '#fef9ec' : '#f5f5f5', color: u.role === 'admin' ? '#CFA052' : '#6B7280' }}>
                        {u.role}
                      </span>
                    </div>
                    <div className="flex gap-2 items-center" onClick={e => e.stopPropagation()}>
                      <select
                        value={u.role}
                        onChange={e => updateUserRole(u._id, e.target.value)}
                        className="flex-1 px-3 py-2 border-[1.5px] border-[#e8e0d6] rounded-xl text-[0.82rem] cursor-pointer font-inter bg-[#FAFAFA] outline-none"
                      >
                        {['user', 'admin'].map(r => <option key={r}>{r}</option>)}
                      </select>
                      {u._id !== user._id && (
                        <button
                          onClick={() => deleteUser(u._id)}
                          className="w-9 h-9 rounded-xl border-[1.5px] border-[#fee2e2] bg-white cursor-pointer flex items-center justify-center hover:bg-red-50"
                        >
                          <DeleteOutlineIcon sx={{ fontSize: 16, color: '#f87171' }} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.05)]">
              <table className="w-full border-collapse">
                <thead className="bg-[#f9f6f1]">
                  <tr>
                    {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3.5 text-left text-[0.72rem] font-bold text-[#9CA3AF] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter(u =>
                      u.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
                      u.email.toLowerCase().includes(adminSearch.toLowerCase())
                    )
                    .map(u => (
                      <tr
                        key={u._id}
                        className="border-b border-[#f5f0e8] cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                        onClick={() => setSelectedUser(u)}
                      >
                        <td className="px-4 py-3.5 font-semibold">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#f5ede0] flex items-center justify-center font-playfair font-bold text-[#CFA052] text-sm flex-shrink-0">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-[0.85rem] text-[#6B7280]">{u.email}</td>
                        <td className="px-4 py-3.5">
                          <span className="px-3 py-1 rounded-full text-[0.72rem] font-bold"
                            style={{ background: u.role === 'admin' ? '#fef9ec' : '#f5f5f5', color: u.role === 'admin' ? '#CFA052' : '#6B7280' }}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-[0.8rem] text-[#9CA3AF]">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3.5" onClick={e => e.stopPropagation()}>
                          <div className="flex gap-2 items-center">
                            <select
                              value={u.role}
                              onChange={e => updateUserRole(u._id, e.target.value)}
                              className="px-2.5 py-1.5 border-[1.5px] border-[#e8e0d6] rounded-lg text-[0.8rem] cursor-pointer font-inter bg-white outline-none"
                            >
                              {['user', 'admin'].map(r => <option key={r}>{r}</option>)}
                            </select>
                            {u._id !== user._id && (
                              <button
                                onClick={() => deleteUser(u._id)}
                                className="w-8 h-8 rounded-lg border-[1.5px] border-[#fee2e2] bg-white cursor-pointer flex items-center justify-center hover:bg-red-50"
                              >
                                <DeleteOutlineIcon sx={{ fontSize: 16, color: '#f87171' }} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* USER DETAILS MODAL */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-[8px] z-[1000] flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white w-full max-w-[700px] max-h-[90vh] flex flex-col rounded-3xl p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.2)] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 bg-[#f5f0e8] border-none w-8 h-8 rounded-full cursor-pointer flex items-center justify-center text-[#6B7280] z-10 hover:bg-[#e8e0d6] transition-colors"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>

            {(() => {
              const userOrders = orders.filter(o => o.user?._id === selectedUser._id || o.user === selectedUser._id);
              const totalSpent = userOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

              return (
                <>
                  {/* Header & Stats */}
                  <div className="flex-shrink-0">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#f5ede0] flex items-center justify-center font-playfair font-bold text-[#CFA052] text-2xl sm:text-3xl flex-shrink-0">
                        {selectedUser.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="font-playfair text-xl sm:text-2xl font-bold text-[#1A1A1A]">{selectedUser.name}</div>
                        <div className="text-[0.85rem] text-[#6B7280]">
                          <span className="font-semibold" style={{ color: selectedUser.role === 'admin' ? '#CFA052' : '#6B7280' }}>{selectedUser.role.toUpperCase()}</span>
                          {' • '}Joined {new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        { l: 'Email Address', v: selectedUser.email, copy: true },
                        { l: 'User ID', v: selectedUser._id, copy: true },
                        { l: 'Total Orders', v: userOrders.length, copy: false },
                        { l: 'Lifetime Spent', v: `$${totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, copy: false },
                      ].map(({ l, v, copy }) => (
                        <div key={l} className="bg-[#FAFAFA] px-4 py-3 rounded-xl border border-[#e8e0d6] flex justify-between items-center gap-2">
                          <div className="min-w-0">
                            <div className="text-[0.7rem] font-bold text-[#9CA3AF] tracking-wide uppercase mb-0.5">{l}</div>
                            <div className="text-[0.88rem] text-[#1A1A1A] font-semibold truncate">{v}</div>
                          </div>
                          {copy && (
                            <button
                              onClick={() => { navigator.clipboard.writeText(String(v)); toast.success(`Copied ${l}`); }}
                              className="bg-none border-none cursor-pointer text-[#CFA052] p-1 rounded-lg hover:bg-[#fef9ec] flex-shrink-0"
                              title="Copy"
                            >
                              <ContentCopyIcon sx={{ fontSize: 16 }} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="font-playfair text-lg font-bold pb-3 border-b border-[#f0ebe3]">Order History</div>
                  </div>

                  {/* Scrollable Orders List */}
                  <div className="flex-1 overflow-y-auto pr-1 mt-4">
                    {userOrders.length === 0 ? (
                      <div className="text-[0.95rem] text-[#9CA3AF] italic text-center py-8">This user hasn't placed any orders yet.</div>
                    ) : (
                      <div className="flex flex-col gap-4 pb-2">
                        {userOrders.slice().reverse().map(o => (
                          <div key={o._id} className="border border-[#f5f0e8] rounded-2xl p-4 sm:p-5 bg-[#FAFAFA]">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="text-[0.72rem] font-extrabold text-[#CFA052] tracking-wide">ORDER #{o._id?.slice(-8).toUpperCase()}</div>
                                <div className="text-[0.85rem] text-[#1A1A1A] font-semibold mt-0.5">{new Date(o.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-base font-bold text-[#1A1A1A] font-playfair">${o.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                <div
                                  className="text-[0.7rem] font-bold px-2.5 py-1 rounded-full inline-block mt-1.5 uppercase tracking-wide"
                                  style={{
                                    color: o.status === 'Delivered' ? '#166534' : o.status === 'Cancelled' ? '#b91c1c' : '#92400e',
                                    background: o.status === 'Delivered' ? '#dcfce7' : o.status === 'Cancelled' ? '#fef2f2' : '#fef9ec'
                                  }}
                                >
                                  {o.status || 'Processing'}
                                </div>
                              </div>
                            </div>

                            {o.shippingAddress && (
                              <div className="text-[0.82rem] text-[#4B5563] bg-white px-3.5 py-3 rounded-xl border border-[#e8e0d6] leading-[1.5] mb-4">
                                <div className="flex justify-between items-center mb-1.5">
                                  <span className="font-bold text-[#1A1A1A] text-[0.75rem] uppercase tracking-wide">Delivery Destination</span>
                                  <button
                                    onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(`${o.shippingAddress.address}, ${o.shippingAddress.city}, ${o.shippingAddress.postalCode}, ${o.shippingAddress.country}`); toast.success('Shipping address copied'); }}
                                    className="bg-none border-none cursor-pointer text-[#CFA052] p-1 rounded-md hover:bg-[#fef9ec] flex items-center"
                                    title="Copy Address"
                                  >
                                    <ContentCopyIcon sx={{ fontSize: 14 }} />
                                  </button>
                                </div>
                                {o.shippingAddress.address}<br />
                                {o.shippingAddress.city}, {o.shippingAddress.postalCode}<br />
                                {o.shippingAddress.country}
                              </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {o.orderItems?.map(item => (
                                <div
                                  key={item._id || item.product}
                                  onClick={() => { setSelectedUser(null); navigate(`/product/${item.product}`); }}
                                  className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#e8e0d6] cursor-pointer hover:border-[#CFA052] transition-colors"
                                >
                                  <div className="w-11 h-11 rounded-xl bg-[#f5ede0] flex-shrink-0 overflow-hidden">
                                    <img
                                      src={item.image?.startsWith('/uploads') ? `${API.replace('/api', '')}${item.image}` : item.image}
                                      alt={item.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[0.8rem] font-semibold text-[#1A1A1A] truncate mb-0.5">{item.name}</div>
                                    <div className="text-[0.72rem] text-[#9CA3AF] flex justify-between">
                                      <span>Qty: <span className="font-semibold text-[#1A1A1A]">{item.qty}</span></span>
                                      <span className="font-semibold text-[#CFA052]">${item.price?.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
