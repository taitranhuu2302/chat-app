import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getRandomInt } from '@/utils/NumberUtils';
import volume from '@/components/MP3/Volume';

export type PlaylistType = {
  items: SongInfoType[];
  type: string;
};

interface IState {
  open: boolean;
  songCurrent: SongInfoType | null;
  volume: number;
  currentTime: number;
  currentTimeChange: number;
  isPlaying: boolean;
  isLoop: boolean;
  isRandom: boolean;
  playlist: PlaylistType;
}

const initialState: IState = {
  open: false,
  songCurrent: null,
  volume: 0.8,
  currentTime: 0,
  currentTimeChange: 0,
  isPlaying: true,
  isLoop: false,
  isRandom: false,
  playlist: {
    items: [],
    type: '',
  },
};

export const setConfigMusic = (config: {
  volume?: number;
  isLoop?: boolean;
  isRandom?: boolean;
  playlist?: PlaylistType;
  songCurrent?: SongInfoType;
}) => {
  const configLocal = getConfigMusic();
  const obj = {
    ...configLocal,
    ...config,
  };
  localStorage.setItem("config", JSON.stringify(obj))
};

export const getConfigMusic = () => {
  return localStorage.getItem('config')
    ? JSON.parse(localStorage.getItem('config')!)
    : {};
};

const musicSlice = createSlice({
  name: 'musicSlice',
  initialState,
  reducers: {
    onOpenMusic: (state, { payload }: PayloadAction<boolean>) => {
      state.open = payload;
    },
    setSongCurrent: (state, { payload }: PayloadAction<SongInfoType>) => {
      state.songCurrent = payload;
      setConfigMusic({songCurrent: payload})
    },
    setVolume: (state, { payload }: PayloadAction<number>) => {
      state.volume = payload;
      setConfigMusic({volume: payload})
    },
    setCurrentTime: (state, { payload }: PayloadAction<number>) => {
      state.currentTime = payload;
    },
    setCurrentTimeChange: (state, { payload }: PayloadAction<number>) => {
      state.currentTimeChange = payload;
    },
    setIsRandom: (state, { payload }: PayloadAction<boolean | undefined>) => {
      if (typeof payload === 'undefined') {
        state.isRandom = !state.isRandom;
        setConfigMusic({isRandom: state.isRandom})
        return;
      }
      state.isRandom = payload;
      setConfigMusic({isRandom: payload})
    },
    setIsLoop: (state, { payload }: PayloadAction<boolean | undefined>) => {
      if (typeof payload === 'undefined') {
        state.isLoop = !state.isLoop;
        setConfigMusic({isLoop: state.isLoop})
        return;
      }
      state.isLoop = payload;
      setConfigMusic({isLoop: payload})
    },
    setIsPlaying: (state, { payload }: PayloadAction<boolean | null>) => {
      if (typeof payload === 'boolean') {
        state.isPlaying = payload;
      } else {
        state.isPlaying = !state.isPlaying;
      }
    },
    setSongChange: (
      state,
      { payload }: PayloadAction<'Previous' | 'Next' | undefined>
    ) => {
      const indexItemCurrent = state.playlist.items.findIndex(
        (item) => item.encodeId === state.songCurrent?.encodeId
      );

      if (typeof payload === 'undefined' && state.isRandom) {
        const position = indexItemCurrent + getRandomInt(1, 10);
        state.songCurrent =
          position > state.playlist.items.length - 1
            ? state.playlist.items[state.playlist.items.length - 1]
            : state.playlist.items[position];
        return;
      }

      if (payload === 'Next' || typeof payload === 'undefined') {
        state.songCurrent =
          indexItemCurrent === state.playlist.items.length - 1
            ? state.playlist.items[0]
            : state.playlist.items[indexItemCurrent + 1];
        return;
      }

      if (payload === 'Previous') {
        state.songCurrent =
          indexItemCurrent === 0
            ? state.playlist.items[state.playlist.items.length - 1]
            : state.playlist.items[indexItemCurrent - 1];
        return;
      }
    },
    setPlayList: (
      state,
      {
        payload,
      }: PayloadAction<{
        type: string;
        items: SongInfoType[];
        isDefaultSong: boolean;
      }>
    ) => {
      if (payload.type === state.playlist.type || !payload.items.length) return;

      state.playlist = {
        items: [...payload.items],
        type: payload.type,
      };
      setConfigMusic({playlist: state.playlist})
      if (payload.isDefaultSong) {
        state.songCurrent = payload.items[0];
      }
    },
    setConfigDefaultMusic: (state) => {
      const configDefault = getConfigMusic();
      if ('isLoop' in configDefault) state.isLoop = configDefault.isLoop
      if ('isRandom' in configDefault) state.isRandom = configDefault.isRandom
      if ('playlist' in configDefault) state.playlist = configDefault.playlist
      if ('volume' in configDefault) state.volume = configDefault.volume
      if ('songCurrent' in configDefault) state.songCurrent = configDefault.songCurrent
      state.isPlaying = false
    }
  },
});

export const {
  setSongChange,
  onOpenMusic,
  setSongCurrent,
  setVolume,
  setCurrentTime,
  setConfigDefaultMusic,
  setPlayList,
  setIsPlaying,
  setIsRandom,
  setIsLoop,
} = musicSlice.actions;

export default musicSlice.reducer;
