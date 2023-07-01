import { combineReducers } from 'redux';
import pageLoadingSlice from './features/PageLoadingSlice';
import notifySlice from '@/redux/features/NotifySlice';
import messageSlice from '@/redux/features/MessageSlice';

export const reducers = combineReducers({
  pageLoading: pageLoadingSlice,
  notify: notifySlice,
  message: messageSlice,
});
