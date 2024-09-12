import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

export const searchLeads = createAsyncThunk(
  'searchLeads/searchLeads',
  async (filterString, { rejectWithValue }) => { // We now send filterString directly
    const token = localStorage.getItem('token');
    if (!token) {
      return rejectWithValue('No authentication token found');
    }

    try {
      // Sending filterString in the POST request payload
      const response = await api.post(
        '/leads/filter',
        { filterString }, // Directly sending filterString in the payload
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
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
  reducers:{
    refreshFilter: (state) => {
      state.data = [];
      state.status = 'idle';
      state.error = null;
    },
  },
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

export const { refreshFilter } = searchLeadsSlice.actions;
export default searchLeadsSlice.reducer;
