import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IState {
  open: boolean;
  songCurrent: SongInfoType | null,
  volume: number;
  currentTime: number,
  currentTimeChange: number;
  isPlaying: boolean;
}

const initialState: IState = {
  open: false,
  songCurrent: null,
  volume: 80,
  currentTime: 0,
  currentTimeChange: 0,
  isPlaying: false
};

const musicSlice = createSlice({
  name: 'musicSlice',
  initialState,
  reducers: {
    onOpenMusic: (state, {payload}: PayloadAction<boolean>) => {
      state.open = payload;
    },
    setSongCurrent: (state, {payload}: PayloadAction<SongInfoType>) => { 
      state.songCurrent = payload
    },
    setVolume: (state, {payload}: PayloadAction<number>) => {
      state.volume = payload;
    },
    setCurrentTime: (state, {payload}: PayloadAction<number>) => {
      state.currentTime = payload;
    },
    setCurrentTimeChange: (state, {payload}: PayloadAction<number>) => {
      state.currentTimeChange = payload;
    },
    setIsPlaying: (state, {payload}: PayloadAction<boolean | null>) =>{ 
      if (typeof payload === 'boolean') {
        state.isPlaying = payload;
      } else {
        state.isPlaying = !state.isPlaying
      }
    }
  },
});

export const { onOpenMusic, setSongCurrent, setVolume, setCurrentTime, setCurrentTimeChange, setIsPlaying } = musicSlice.actions;

export default musicSlice.reducer;
