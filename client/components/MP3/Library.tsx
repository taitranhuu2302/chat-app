import React, { PropsWithChildren } from 'react';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import MediaItem from '@/components/MP3/MediaItem';
import useTranslate from '@/hooks/useTranslate';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setPlayList } from '@/redux/features/MusicSlice';

interface IProps {}

const Library: React.FC<PropsWithChildren<IProps>> = () => {
  const t = useTranslate();
  const favourite = useAppSelector((state) => state.music.favourite);
  const dispatch = useAppDispatch();
  return (
    <div className={'h-full flex flex-col overflow-auto'}>
      <div className={'flex items-center gap-3'}>
        <p className={'text-3xl tracking-wide text-white font-bold'}>
          {t.library}
        </p>
        <button
          onClick={() =>
            dispatch(
              setPlayList({
                items: favourite.map((item) => item.song) as SongInfoType[],
                type: 'favourite',
                isDefaultSong: true,
              })
            )
          }>
          <BsFillPlayCircleFill size={30} color={'white'} />
        </button>
      </div>
      <div className={'space-y-2.5 py-2.5'}>
        {favourite
          .slice(0)
          .reverse()
          .map((item, index) => {
            return (
              <MediaItem
                key={item.id}
                data={item.song}
                index={index + 1}
                playlist={{
                  items: favourite.map((item) => item.song) as SongInfoType[],
                  type: 'favourite',
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Library;
