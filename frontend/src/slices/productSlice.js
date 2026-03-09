import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
const getH = (getState) => ({ Authorization: `Bearer ${getState().auth.user?.token}` });

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== '' && v !== undefined) q.append(k, v); });
    const { data } = await axios.get(`${API}/products?${q.toString()}`);
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const fetchProductById = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try { const { data } = await axios.get(`${API}/products/${id}`); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const submitReview = createAsyncThunk('products/review', async ({ productId, rating, comment }, { getState, rejectWithValue }) => {
  try { await axios.post(`${API}/products/${productId}/reviews`, { rating, comment }, { headers: getH(getState) }); return true; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Review failed'); }
});

const productSlice = createSlice({
  name: 'products',
  initialState: { list: [], current: null, page: 1, pages: 1, total: 0, loading: false, error: null },
  reducers: {
    resetProducts: (s) => { s.list = []; s.page = 1; }
  },
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, s => { s.loading = true; });
    b.addCase(fetchProducts.fulfilled, (s, a) => {
      s.loading = false;
      const data = a.payload;
      if (Array.isArray(data)) {
        s.list = data;
        s.page = 1;
        s.pages = 1;
        s.total = data.length;
      } else if (data && data.products) {
        const { products, page, pages, total } = data;
        if (page === 1) {
          s.list = products;
        } else {
          s.list = [...s.list, ...products];
        }
        s.page = page;
        s.pages = pages;
        s.total = total;
      }
    });
    b.addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    b.addCase(fetchProductById.pending, s => { s.loading = true; s.current = null; });
    b.addCase(fetchProductById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; });
    b.addCase(fetchProductById.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const { resetProducts } = productSlice.actions;
export default productSlice.reducer;
