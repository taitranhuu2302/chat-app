import { v4 as uuidV4 } from 'uuid';

export type TabAudioActiveType = 'List' | 'Lyric';

export type TabAudioType = {
  id: string;
  name: string;
  type: TabAudioActiveType;
};

export const TAB_AUDIO_MODAL: TabAudioType[] = [
  {
    id: uuidV4(),
    name: 'Danh sách phát',
    type: 'List',
  },
  {
    id: uuidV4(),
    name: 'Lời bài hát',
    type: 'Lyric',
  }
];