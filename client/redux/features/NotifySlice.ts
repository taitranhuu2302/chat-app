import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  countRequestFriend: number;
}

const initialState: IState = {
  countRequestFriend: 0,
};

const notifySlice = createSlice({
  name: 'notifySlice',
  initialState,
  reducers: {
    setCountRequestFriend: (state, { payload }: PayloadAction<number>) => {
      state.countRequestFriend = payload;
    },
  },
});

export const { setCountRequestFriend } = notifySlice.actions;

export default notifySlice.reducer;
