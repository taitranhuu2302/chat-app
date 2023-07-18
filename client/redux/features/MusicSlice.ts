import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  open: boolean;
}

const initialState: IState = {
  open: false
};

const musicSlice = createSlice({
  name: 'musicSlice',
  initialState,
  reducers: {
    onOpenMusic: (state, {payload}: PayloadAction<boolean>) => {
      state.open = payload;
    }
  },
});

export const { onOpenMusic } = musicSlice.actions;

export default musicSlice.reducer;
