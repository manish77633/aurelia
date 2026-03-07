import React, { useEffect, useState, useRef } from 'react';
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

const TABS = ['Dashboard', 'Products', 'Orders', 'Users'];
const CATS = ['Luxury Watches', 'Designer Bags', 'Premium Shoes', 'Exclusive Apparel'];
const IMG_METHODS = ['URL', 'Upload'];

const EMPTY_FORM = { name: '', description: '', price: '', category: 'Luxury Watches', colors: '', countInStock: '', featured: false, image: '' };

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
  const [imgMethod, setImgMethod] = useState('URL');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mobileTabOpen, setMobileTabOpen] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchStats(); fetchProducts(); fetchOrders(); fetchUsers();
  }, []);

  const fetchStats = async () => {
    try { const { data } = await axios.get(`${API}/admin/stats`, { headers }); setStats(data); } catch { }
  };
  const fetchProducts = async () => {
    try { const { data } = await axios.get(`${API}/products`, { headers }); setProducts(data); } catch { }
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
  }, [tab]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const resetForm = () => { setForm(EMPTY_FORM); setEditId(null); setImageFile(null); setImagePreview(''); setImgMethod('URL'); };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) { toast.error('Name, price, category required'); return; }
    if (imgMethod === 'URL' && !form.image) { toast.error('Image URL required'); return; }
    if (imgMethod === 'Upload' && !imageFile && !editId) { toast.error('Please select an image file'); return; }
    setLoading(true);
    try {
      let formData;
      if (imgMethod === 'Upload' && imageFile) {
        formData = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (k !== 'image') formData.append(k, v); });
        formData.append('image', imageFile);
      } else {
        formData = form;
      }
      const config = {
        headers: {
          ...headers,
          ...(imgMethod === 'Upload' && imageFile ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' }),
        },
      };
      if (editId) {
        await axios.put(`${API}/products/${editId}`, formData, config);
        toast.success('Product updated ✨');
      } else {
        await axios.post(`${API}/products`, formData, config);
        toast.success('Product added 🎉');
      }
      resetForm(); fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
    setLoading(false);
  };

  const handleEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, category: p.category, colors: (p.colors || []).join(', '), countInStock: p.countInStock, featured: p.featured, image: p.image });
    setImagePreview(p.image); setImgMethod('URL'); setEditId(p._id);
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
    return { bg: '#fef9ec', color: '#92400e' };
  };

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
                { Icon: AttachMoneyIcon, label: 'Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString()}`, color: '#f59e0b', target: 'Dashboard' },
              ].map(({ Icon, label, value, color, target }) => (
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
                </div>
              ))}
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

                {/* Description */}
                <div className="sm:col-span-2 lg:col-span-1">
                  <label className={lbl}>Description</label>
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

              {/* IMAGE METHOD TABS */}
              <div className="mb-4">
                <label className={lbl}>Product Image</label>
                <div className="flex bg-[#f5f0e8] rounded-xl p-1 mb-3.5">
                  {IMG_METHODS.map(m => (
                    <button
                      key={m}
                      onClick={() => { setImgMethod(m); setImageFile(null); setImagePreview(m === 'URL' ? form.image : ''); }}
                      className="flex-1 py-2 border-none rounded-lg font-inter text-[0.82rem] font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-200"
                      style={{ background: imgMethod === m ? '#CFA052' : 'transparent', color: imgMethod === m ? '#fff' : '#6B7280' }}
                    >
                      {m === 'URL' ? <LinkIcon sx={{ fontSize: 14 }} /> : <CloudUploadOutlinedIcon sx={{ fontSize: 14 }} />} {m}
                    </button>
                  ))}
                </div>

                {imgMethod === 'URL' ? (
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={form.image}
                    onChange={e => { setForm({ ...form, image: e.target.value }); setImagePreview(e.target.value); }}
                    className={inp}
                  />
                ) : (
                  <div
                    onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-[#e8e0d6] rounded-xl p-7 text-center cursor-pointer transition-all duration-200 bg-[#FAFAFA] hover:border-[#CFA052]"
                  >
                    <AddPhotoAlternateOutlinedIcon sx={{ fontSize: 32, color: '#CFA052' }} />
                    <div className="text-[0.85rem] font-semibold text-[#6B7280] mt-2">{imageFile ? imageFile.name : 'Click to upload image'}</div>
                    <div className="text-[0.75rem] text-[#9CA3AF] mt-1">PNG, JPG, WEBP up to 5MB</div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>
                )}

                {/* Preview */}
                {imagePreview && (
                  <div className="mt-3 rounded-xl overflow-hidden h-36 bg-[#f5ede0] relative">
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" onError={e => e.target.style.display = 'none'} />
                    <div className="absolute top-1.5 right-1.5 bg-[#10b981] rounded-full w-5 h-5 flex items-center justify-center">
                      <CheckCircleOutlinedIcon sx={{ fontSize: 14, color: '#fff' }} />
                    </div>
                  </div>
                )}
              </div>

              <button className="btn-gold w-full py-3.5 text-[0.92rem] mt-1" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : editId ? 'Update Product' : 'Add Product'}
              </button>
            </div>

            {/* PRODUCT LIST */}
            <div>
              <div className="font-playfair text-xl font-bold mb-5">{products.length} Products</div>
              <div className="flex flex-col gap-3">
                {products.map(p => (
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
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ──────────────────────────────── */}
        {tab === 'Orders' && (
          <div>
            <h2 className="font-playfair text-2xl font-bold mb-6">All Orders ({orders.length})</h2>

            {/* Mobile card view */}
            <div className="flex flex-col gap-4 lg:hidden">
              {orders.map(o => {
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
                      {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
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
                  {orders.map(o => {
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
                            {['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map(s => <option key={s}>{s}</option>)}
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
            <h2 className="font-playfair text-2xl font-bold mb-6">All Users ({users.length})</h2>

            {/* Mobile card view */}
            <div className="flex flex-col gap-4 lg:hidden">
              {users.map(u => (
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
                  {users.map(u => (
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
