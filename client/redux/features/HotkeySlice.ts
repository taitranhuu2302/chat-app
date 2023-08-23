import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  open: boolean;
  isDisabledHotkey: boolean;
}

const initialState: IState = { isDisabledHotkey: false, open: false };

const hotkeySlice = createSlice({
  name: 'HotkeySlice',
  initialState,
  reducers: {
    onOpenHotkey: (state, { payload }: PayloadAction<boolean | undefined>) => {
      if (typeof payload === 'undefined') {
        state.open = !state.open;
        return;
      }
      state.open = payload;
    },
    onDisabledHotkey: (state, { payload }: PayloadAction<boolean>) => {
      state.isDisabledHotkey = payload;
    },
  },
});

export const { onOpenHotkey, onDisabledHotkey } = hotkeySlice.actions;

export default hotkeySlice.reducer;
