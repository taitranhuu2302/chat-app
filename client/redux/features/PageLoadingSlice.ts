import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  isPageLoading: boolean;
  loadingTimer: NodeJS.Timeout | null;
}

const initialState: IState = {
  isPageLoading: false,
  loadingTimer: null,
};

const pageLoadingSlice = createSlice({
  name: 'pageLoadingSlice',
  initialState,
  reducers: {
    onPageLoading: (state, { payload }: PayloadAction<boolean>) => {
      state.isPageLoading = payload;
    },
  },
});
export const { onPageLoading } = pageLoadingSlice.actions;

export default pageLoadingSlice.reducer;
