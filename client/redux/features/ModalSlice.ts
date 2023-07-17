import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IState {
  openModalVideoCalling: boolean;
  modalVideoCall: {
    isOpen: boolean;
    type: "Request" | "Default",
    userCall?: UserType | null
  };
}

const initialState: IState = {
  openModalVideoCalling: false,
  modalVideoCall: {
    isOpen: false,
    type: "Default",
    userCall: null
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
      userCall?: UserType
    }>) => {
      state.modalVideoCall = {
        ...payload,
        type: payload.type || "Default",
      }
    },
  },
});

export const {setOpenModalVideoCalling, setModalVideoCall} = modalSlice.actions;

export default modalSlice.reducer;
