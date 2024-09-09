import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const searchLeads = createAsyncThunk(
  'searchLeads/searchLeads',
  async (query, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      const response = await axios.get(`/api/leads/search`, {
        params: { query },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch leads');
    }
  }
);

const searchLeadsSlice = createSlice({
  name: 'searchLeads',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(searchLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default searchLeadsSlice.reducer;
