import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: null, 
  editable: true
};

const editLeadSlice = createSlice({
  name: 'editLead',
  initialState,
  reducers: {
    setData(state, action) {
      state.data = action.payload;
      state.editable = true;
    },
    clearData(state) {
      state.data = null;
    },
  },
});

export const { setData, clearData } = editLeadSlice.actions;

export default editLeadSlice.reducer;
