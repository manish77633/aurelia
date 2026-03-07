import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
const getH = (getState) => ({ Authorization: `Bearer ${getState().auth.user?.token}` });

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { getState, rejectWithValue }) => {
  try { const { data } = await axios.get(`${API}/wishlist`, { headers: getH(getState) }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});
export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { getState, rejectWithValue }) => {
  try { const { data } = await axios.post(`${API}/wishlist/${productId}`, {}, { headers: getH(getState) }); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed'); }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], loading: false, error: null },
  reducers: {
    resetWishlist: (state) => { state.items = []; },
  },
  extraReducers: (b) => {
    b.addCase(fetchWishlist.fulfilled, (s, a) => { s.items = a.payload?.products || []; });
    b.addCase(toggleWishlist.fulfilled, (s, a) => { s.items = a.payload?.wishlist?.products || a.payload?.products || []; });
  },
});

export const { resetWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
