import { combineReducers } from 'redux';
import pageLoadingSlice from './features/PageLoadingSlice';
import notifySlice from "@/redux/features/NotifySlice";

export const reducers = combineReducers({
  pageLoading: pageLoadingSlice,
  notify: notifySlice
});