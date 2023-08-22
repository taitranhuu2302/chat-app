import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  open: boolean;
}

const initialState: IState = { open: false };

const hotkeySlice = createSlice({
  name: 'HotkeySlice',
  initialState,
  reducers: {
    onOpenHotkey: (state, { payload }: PayloadAction<boolean>) => {
      state.open = payload;
    },
  },
});

export const { onOpenHotkey } = hotkeySlice.actions;

export default hotkeySlice.reducer;
