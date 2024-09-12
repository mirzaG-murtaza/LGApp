import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import addLeadsReducer from '../features/data/Leads/addLeadsSlice';
import getLeadsReducer from '../features/data/Leads/getLeadsSlice';
import updateLeadReducer from '../features/data/Leads/updateLeadSlice';
import viewLeadsReducer from '../features/data/Leads/viewLeadsSlice';
import searchLeadsReducer from '../features/data/Leads/searchLeadsSlice';
import getEditLeadReducer from '../features/data/Leads/getEditLeadSlice';


const rootReducer = combineReducers({
  auth: authReducer,
  addLeads: addLeadsReducer,
  getLeads: getLeadsReducer,
  updateLeads: updateLeadReducer,
  viewLeads: viewLeadsReducer,
  searchLeads: searchLeadsReducer,
  editLead: getEditLeadReducer
});

export default rootReducer;
