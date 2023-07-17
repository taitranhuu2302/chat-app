import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  openModalVideoCalling: boolean;
}

const initialState: IState = {
  openModalVideoCalling: false
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    setOpenModalVideoCalling: (state, {payload}: PayloadAction<boolean>) => {
      state.openModalVideoCalling = payload;
    }
  },
});

export const { setOpenModalVideoCalling } = modalSlice.actions;

export default modalSlice.reducer;
