import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  reply?: MessageType;
}

const initialState: IState = {
  reply: undefined,
};

const messageSlice = createSlice({
  name: 'messageSlice',
  initialState,
  reducers: {
    setReplyMessage: (
      state,
      { payload }: PayloadAction<MessageType | undefined>
    ) => {
      state.reply = payload;
    },
  },
});

export const { setReplyMessage } = messageSlice.actions;

export default messageSlice.reducer;
