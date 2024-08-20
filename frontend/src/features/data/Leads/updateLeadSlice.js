import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';

// Thunk for updating a lead
export const updateLead = createAsyncThunk(
  'leads/updateLead',
  async ({ id, ...updatedData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/leads/update/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const updateLeadsSlice = createSlice({
    name: 'leads',
    initialState: {
      data: [],
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(updateLead.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(updateLead.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.data = state.data.map((lead) =>
            lead.id === action.payload.id ? action.payload : lead
          );
        })
        .addCase(updateLead.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    },
  });
  
  export default updateLeadsSlice.reducer;
  