import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type PlaylistType = {
  items: SongInfoType[],
  type: string
}

interface IState {
  open: boolean;
  songCurrent: SongInfoType | null;
  volume: number;
  currentTime: number;
  currentTimeChange: number;
  isPlaying: boolean;
  isLoop: boolean;
  isRandom: boolean;
  playlist: PlaylistType
}

const initialState: IState = {
  open: false,
  songCurrent: null,
  volume: 0.8,
  currentTime: 0,
  currentTimeChange: 0,
  isPlaying: false,
  isLoop: false,
  isRandom: false,
  playlist: {
    items: [],
    type: ""
  }
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
    setIsRandom: (state,{ payload} : PayloadAction<boolean | undefined>) => {
      if (typeof payload === 'undefined') {
        state.isRandom = !state.isRandom
        return
      }
      state.isRandom = payload;
    },
    setIsLoop: (state,{ payload} : PayloadAction<boolean | undefined>) => {
      if (typeof payload === 'undefined') {
        state.isLoop = !state.isLoop
        return
      }
      state.isLoop = payload;
    },
    setIsPlaying: (state, {payload}: PayloadAction<boolean | null>) =>{ 
      if (typeof payload === 'boolean') {
        state.isPlaying = payload;
      } else {
        state.isPlaying = !state.isPlaying
      }
    },
    setSongChange: (state, {payload}: PayloadAction<"Previous" | "Next">) => { 
      if (payload === 'Next') {

        if (state.isRandom) {

          return;
        }

        const indexItemCurrent = state.playlist.items.findIndex((item) => item.encodeId === state.songCurrent?.encodeId)
        state.songCurrent = indexItemCurrent === state.playlist.items.length - 1 ? state.playlist.items[0] : state.playlist.items[indexItemCurrent + 1]
        return;
      }
      
      if (payload === 'Previous') {

        if (state.isRandom) {

          return;
        }

        const indexItemCurrent = state.playlist.items.findIndex((item) => item.encodeId === state.songCurrent?.encodeId)
        state.songCurrent = indexItemCurrent === 0 ? state.playlist.items[state.playlist.items.length - 1] : state.playlist.items[indexItemCurrent - 1]
        return;
      }
    },
    setPlayList: (state, {payload}: PayloadAction<{type: string, items: SongInfoType[], isDefaultSong: boolean}>) => {
      if (payload.type === state.playlist.type || !payload.items.length) return;
      
      state.playlist = {
        items: [...payload.items],
        type: payload.type
      }
      if (payload.isDefaultSong) {
        state.songCurrent = payload.items[0]
      }
    }
  },
});

export const { setSongChange,onOpenMusic, setSongCurrent, setVolume, setCurrentTime, setCurrentTimeChange, setPlayList, setIsPlaying, setIsRandom, setIsLoop } = musicSlice.actions;

export default musicSlice.reducer;
