import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  reply: MessageType | null;
}

const initialState: IState = {
  reply: null,
};

const messageSlice = createSlice({
  name: 'messageSlice',
  initialState,
  reducers: {
    setReplyMessage: (
      state,
      { payload }: PayloadAction<MessageType | null>
    ) => {
      state.reply = payload;
    },
  },
});

export const { setReplyMessage } = messageSlice.actions;

export default messageSlice.reducer;
