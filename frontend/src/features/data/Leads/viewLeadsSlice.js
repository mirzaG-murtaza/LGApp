import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

export const viewLeads = createAsyncThunk(
  'leads/viewLeads',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await api.get('/leads/allLeads', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const viewLeadsSlice = createSlice({
  name: 'allLeads',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    refreshLeads: (state) => {
      state.data = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(viewLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(viewLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(viewLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { refreshLeads } = viewLeadsSlice.actions;
export default viewLeadsSlice.reducer;