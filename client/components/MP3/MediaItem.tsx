import React, { PropsWithChildren, useCallback, useState } from 'react';
import styles from '@/styles/components/music.module.scss';
import { convertSecondToMinute } from '@/utils/TimerUtils';
import ButtonHeart from '@/components/MP3/ButtonHeart';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  PlaylistType,
  setPlayList,
  setSongCurrent,
} from '@/redux/features/MusicSlice';
import MenuActions from './MenuContext/MenuActions';

interface IProps {
  data: SongInfoType;
  index: number;
  playlist: PlaylistType;
}

const initialMenuContext = {
  song: null,
  x: 0,
  y: 0,
}


const MediaItem: React.FC<PropsWithChildren<IProps>> = ({
  data,
  index,
  playlist,
}) => {
  const dispatch = useAppDispatch();
  const { songCurrent } = useAppSelector((state) => state.music);
  const [openMenuContext, setOpenMenuContext] = useState<{
    song: SongInfoType | null;
    x: number;
    y: number;
  }>(initialMenuContext)
  const topLevel = (n: number) => {
    if (n > 3) return '';
    if (n === 1) return styles.level1;
    if (n === 2) return styles.level2;
    if (n === 3) return styles.level3;
  };

  const handleChooseSong = useCallback(() => {
    const song: SongInfoType = {
      ...data,
    };
    dispatch(setSongCurrent(song));
    dispatch(setPlayList({ ...playlist, isDefaultSong: false }));
  }, [data]);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, song: SongInfoType) => {
    event.preventDefault();
    const {pageX, pageY} = event;
    setOpenMenuContext({
      song,
      x: pageX,
      y: pageY
    })
  }

  return (
    <div
      onContextMenu={(event) => handleContextMenu(event, data)}
      className={`${styles.mediaItem} ${
        songCurrent?.encodeId === data.encodeId ? styles.active : ''
      }`}>
      <div className={'w-1/2 flex items-center gap-2.5'}>
        <p className={`${styles.mediaItemCount} ${topLevel(index)}`}>{index}</p>
        <div className={'flex items-center gap-2.5'}>
          <picture onClick={handleChooseSong}>
            <img
              className={'w-[40px] h-[40px] cursor-pointer rounded object-cover'}
              src={data.thumbnail}
              alt=""
            />
          </picture>
          <div>
            <p onClick={handleChooseSong} className={'text-[14px] cursor-pointer font-medium'}>{data.title}</p>
            <p className={styles.textCaption}>{data.artistsNames}</p>
          </div>
        </div>
      </div>
      <div className={'flex-grow'}>
        <p className={styles.textCaption}>{data.album?.title}</p>
      </div>
      <div className={'flex items-center gap-5'}>
        <ButtonHeart song={data as SongInfoType} />
        <time className={styles.textCaption}>
          {convertSecondToMinute(data.duration)}
        </time>
      </div>
      <MenuActions song={openMenuContext.song!} handleChooseSong={handleChooseSong} position={{x: openMenuContext.x, y: openMenuContext.y}} open={!!openMenuContext.song} onClose={() => setOpenMenuContext(initialMenuContext)}/>
    </div>
  );
};

export default MediaItem;
