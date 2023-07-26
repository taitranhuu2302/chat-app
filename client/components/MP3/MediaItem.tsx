import React, { PropsWithChildren, useCallback, useState } from 'react';
import styles from '@/styles/components/music.module.scss';
import { convertSecondToMinute } from '@/utils/TimerUtils';
import ButtonHeart from '@/components/MP3/ButtonHeart';
import { AnimatePresence, motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { PlaylistType, setPlayList, setSongCurrent } from '@/redux/features/MusicSlice';

interface IProps {
  data: ChartItemType;
  index: number;
  playlist: PlaylistType
}

const MediaItem: React.FC<PropsWithChildren<IProps>> = ({ data, index, playlist }) => {
  const dispatch = useAppDispatch()
  const { songCurrent } = useAppSelector(state => state.music)
  
  const topLevel = (n: number) => {
    if (n > 3) return '';
    if (n === 1) return styles.level1;
    if (n === 2) return styles.level2;
    if (n === 3) return styles.level3;
  };

  const handleChooseSong = useCallback(() => {
    const song: SongInfoType = {
      ...data,
    }
    dispatch(setSongCurrent(song))
    dispatch(setPlayList({...playlist, isDefaultSong: false}))
  }, [data])

  return (
    <div className={`${styles.mediaItem} ${songCurrent?.encodeId === data.encodeId ? styles.active : ""}`} onClick={handleChooseSong}>
      <div className={'w-1/2 flex items-center gap-2.5'}>
        <p className={`${styles.mediaItemCount} ${topLevel(index)}`}>{index}</p>
        <div className={'flex items-center gap-2.5'}>
          <picture>
            <img
              className={'w-[40px] h-[40px] rounded object-cover'}
              src={data.thumbnail}
              alt=""
            />
          </picture>
          <div>
            <p className={'text-[14px] font-medium'}>{data.title}</p>
            <p className={styles.textCaption}>{data.artistsNames}</p>
          </div>
        </div>
      </div>
      <div className={'flex-grow'}>
        <p className={styles.textCaption}>{data.album.title}</p>
      </div>
      <div className={'flex items-center gap-5'}>
        <ButtonHeart />
        <time className={styles.textCaption}>
          {convertSecondToMinute(data.duration)}
        </time>
      </div>
    </div>
  );
};

export default MediaItem;
