import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import addLeadsReducer from '../features/data/Leads/addLeadsSlice';
import getLeadsReducer from '../features/data/Leads/getLeadsSlice';
import updateLeadReducer from '../features/data/Leads/updateLeadSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  addLeads: addLeadsReducer,
  getLeads: getLeadsReducer,
  updateLeads: updateLeadReducer
});

export default rootReducer;
