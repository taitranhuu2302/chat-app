import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  openModalVideoCalling: boolean;
  modalVideoCall: {
    isOpen: boolean;
    type: 'Request' | 'Default';
    userCall?: UserType | null;
    conversationId?: string | null;
  };
}

const initialState: IState = {
  openModalVideoCalling: false,
  modalVideoCall: {
    isOpen: false,
    type: "Default",
    userCall: null,
    conversationId: null
  },
};

const modalSlice = createSlice({
  name: 'modalSlice',
  initialState,
  reducers: {
    setOpenModalVideoCalling: (state, {payload}: PayloadAction<boolean>) => {
      state.openModalVideoCalling = payload;
    },
    setModalVideoCall: (state, {payload}: PayloadAction<{
      isOpen: boolean,
      type?: "Request" | "Default",
      userCall?: UserType | null,
      conversationId?: string | null
    }>) => {
      state.modalVideoCall = {
        ...payload,
        userCall: payload.userCall ?? state.modalVideoCall.userCall,
        type: payload.type || "Default",
      }
    },
  },
});

export const {setOpenModalVideoCalling, setModalVideoCall} = modalSlice.actions;

export default modalSlice.reducer;
