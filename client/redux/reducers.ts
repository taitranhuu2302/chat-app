import { combineReducers } from 'redux';
import pageLoadingSlice from './features/PageLoadingSlice';

export const reducers = combineReducers({
  pageLoading: pageLoadingSlice,
});