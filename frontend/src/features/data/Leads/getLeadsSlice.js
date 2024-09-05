import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async ({ leadsId }, { rejectWithValue }) => {
    try {
      // Fetch the token from localStorage
      const token = localStorage.getItem('token');
      
      // If token doesn't exist, you may want to handle it (e.g., reject the action)
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await api.get(`/leads/${leadsId}`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Add the Bearer token here
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
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
      .addCase(fetchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { refreshLeads } = leadsSlice.actions;
export default leadsSlice.reducer;