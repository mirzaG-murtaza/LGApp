import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api';


export const addLeads = createAsyncThunk(
  'leads/addLeads',
  async (value, { rejectWithValue }) => {
    try {
      const payload = JSON.stringify(value);
      const response = await api.post(
        `/leads/create`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

const addLeadsSlice = createSlice({
  name: 'leads',
  initialState: {
    data: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLeads.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addLeads.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(addLeads.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default addLeadsSlice.reducer;
