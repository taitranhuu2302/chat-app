import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  conversation: ConversationType | null;
  userOther: UserType | null;
}

const initialState: IState = {
  conversation: null,
  userOther: null
};

const conversationSlice = createSlice({
  name: 'conversationSlice',
  initialState,
  reducers: {
    setConversationStore: (state, {payload} : PayloadAction<ConversationType | null>) => {
      state.conversation = payload
    },
    setUserOtherStore: (state, {payload}: PayloadAction<UserType | null>) => {
      state.userOther = payload
    }
  },
});

export const {setConversationStore, setUserOtherStore} = conversationSlice.actions;

export default conversationSlice.reducer;
