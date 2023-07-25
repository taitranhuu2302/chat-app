import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  countRequestFriend: number;
  userOnline: string[];
}

const initialState: IState = {
  countRequestFriend: 0,
  userOnline: []
};

const notifySlice = createSlice({
  name: 'notifySlice',
  initialState,
  reducers: {
    setCountRequestFriend: (state, { payload }: PayloadAction<number>) => {
      state.countRequestFriend = payload;
    },
    setUserOnline:(state, {payload}: PayloadAction<string[]>) => {
      state.userOnline = payload;
    }
  },
});

export const { setCountRequestFriend, setUserOnline } = notifySlice.actions;

export default notifySlice.reducer;
