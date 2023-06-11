import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  isPageLoading: boolean;
}

const initialState: IState = {
  isPageLoading: false,
};

const pageLoadingSlice = createSlice({
  name: 'pageLoadingSlice',
  initialState,
  reducers: {
    onPageLoading: (state, { payload }: PayloadAction<boolean | undefined>) => {
      if (typeof payload === 'undefined') {
        state.isPageLoading = !state.isPageLoading;
      } else {
        state.isPageLoading = payload;
      }
    },
  },
});
export const { onPageLoading } = pageLoadingSlice.actions;

export default pageLoadingSlice.reducer;
