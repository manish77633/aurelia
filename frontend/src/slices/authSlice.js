import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;
const saved = localStorage.getItem('aureliaUser');

export const registerUser = createAsyncThunk('auth/register', async (form, { rejectWithValue }) => {
  try { const { data } = await axios.post(`${API}/auth/register`, form); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Registration failed'); }
});
export const loginUser = createAsyncThunk('auth/login', async (form, { rejectWithValue }) => {
  try { const { data } = await axios.post(`${API}/auth/login`, form); return data; }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Login failed'); }
});
export const updateProfile = createAsyncThunk('auth/updateProfile', async (form, { getState, rejectWithValue }) => {
  try {
    const { data } = await axios.put(`${API}/auth/profile`, form, { headers: { Authorization: `Bearer ${getState().auth.user?.token}` } });
    return data;
  } catch (e) { return rejectWithValue(e.response?.data?.message || 'Update failed'); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: saved ? JSON.parse(saved) : null, loading: false, error: null },
  reducers: {
    logout: (state) => { state.user = null; localStorage.removeItem('aureliaUser'); },
    setCredentials: (state, action) => { state.user = action.payload; localStorage.setItem('aureliaUser', JSON.stringify(action.payload)); },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (b) => {
    const save = (state, action) => { state.loading = false; state.user = action.payload; localStorage.setItem('aureliaUser', JSON.stringify(action.payload)); };
    [registerUser, loginUser].forEach(t => {
      b.addCase(t.pending, s => { s.loading = true; s.error = null; });
      b.addCase(t.fulfilled, save);
      b.addCase(t.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
    });
    b.addCase(updateProfile.pending, s => { s.loading = true; });
    b.addCase(updateProfile.fulfilled, (s, a) => { s.loading = false; s.user = { ...s.user, ...a.payload }; localStorage.setItem('aureliaUser', JSON.stringify(s.user)); });
    b.addCase(updateProfile.rejected, (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const { logout, setCredentials, clearError } = authSlice.actions;
export default authSlice.reducer;
