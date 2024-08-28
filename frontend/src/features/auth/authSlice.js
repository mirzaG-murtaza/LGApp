import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import identityApi from '../../utils/identityApi';

// Thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await identityApi.post('/login', credentials);
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token'); 
  return true;
});

// Thunk for refreshing the token
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await identityApi.post('/refresh-token');
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Thunk for removing the token (e.g., when it expires)
export const removeToken = createAsyncThunk('auth/removeToken', async () => {
  localStorage.removeItem('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: localStorage.getItem('token') || null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.status = 'idle';
      })
      .addCase(refreshToken.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(removeToken.fulfilled, (state) => {
        state.token = null;
        state.status = 'idle';
      });
  },
});

export default authSlice.reducer;