import { combineReducers } from 'redux';
import pageLoadingSlice from './features/PageLoadingSlice';
import notifySlice from '@/redux/features/NotifySlice';
import messageSlice from '@/redux/features/MessageSlice';
import modalSlice from './features/ModalSlice';
import conversationSlice from './features/ConversationSlice';
import musicSlice from './features/MusicSlice';
import hotkeySlice from "@/redux/features/HotkeySlice";

export const reducers = combineReducers({
  pageLoading: pageLoadingSlice,
  notify: notifySlice,
  message: messageSlice,
  modal: modalSlice,
  conversation: conversationSlice,
  music: musicSlice,
  hotkey: hotkeySlice
});
