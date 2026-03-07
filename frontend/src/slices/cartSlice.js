import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
const getH = (getState) => ({ Authorization: `Bearer ${getState().auth.user?.token}` });

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { getState, rejectWithValue }) => {
  try { const { data } = await axios.get(`${API}/cart`, { headers: getH(getState) }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const addToCart = createAsyncThunk('cart/add', async ({ productId, qty }, { getState, rejectWithValue }) => {
  try { const { data } = await axios.post(`${API}/cart`, { productId, qty }, { headers: getH(getState) }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, qty }, { getState, rejectWithValue }) => {
  try { const { data } = await axios.put(`${API}/cart/${productId}`, { qty }, { headers: getH(getState) }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const removeFromCart = createAsyncThunk('cart/remove', async (productId, { getState, rejectWithValue }) => {
  try { const { data } = await axios.delete(`${API}/cart/${productId}`, { headers: getH(getState) }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const clearCart = createAsyncThunk('cart/clear', async (_, { getState, rejectWithValue }) => {
  try { await axios.delete(`${API}/cart/clear`, { headers: getH(getState) }); return []; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    resetCart: (state) => { state.items = []; },
  },
  extraReducers: (b) => {
    const handle = (action) => {
      b.addCase(action.pending, s => { s.loading = true; });
      b.addCase(action.fulfilled, (s, a) => { s.loading = false; s.items = a.payload?.items || a.payload || []; });
      b.addCase(action.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    };
    [fetchCart, addToCart, updateCartItem, removeFromCart, clearCart].forEach(handle);
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
