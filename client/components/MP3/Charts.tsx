import MediaItem from '@/components/MP3/MediaItem';
import { setPlayList } from '@/redux/features/MusicSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetCharts } from '@/service/MusicService';
import { BsFillPlayCircleFill } from 'react-icons/bs';
import MenuActions from './MenuContext/MenuActions';
import { useState } from 'react';


const Charts = () => {
  const dispatch = useAppDispatch();
  const playlist = useAppSelector((state) => state.music.playlist);

  const { data } = useGetCharts({
    onSuccess: ({ data }: { data: ChartsType }) => {
      if (playlist.type === 'charts') {
        dispatch(
          setPlayList({
            items: data.items as SongInfoType[],
            type: 'charts',
            isDefaultSong: false,
          })
        );
      }
    },
  });

  return (
    <div onContextMenu={(event) => event.preventDefault()} className={'h-full flex flex-col overflow-auto '}>
      <div className={'flex items-center gap-3'}>
        <p className={'text-3xl tracking-wide text-white font-bold'}>
          BXH Nhạc Mới
        </p>
        <button
          onClick={() => {
            dispatch(
              setPlayList({
                items: data?.data.items as SongInfoType[],
                type: 'charts',
                isDefaultSong: true,
              })
            );
          }}>
          <BsFillPlayCircleFill size={30} color={'white'} />
        </button>
      </div>
      <div className={'space-y-2.5 py-2.5'}>
        {!data?.err &&
          data?.data.items.map((item, index) => (
            <MediaItem
              playlist={{
                items: data?.data.items as SongInfoType[],
                type: 'charts',
              }}
              index={index + 1}
              data={item}
              key={item.encodeId}
            />
          ))}
      </div>
    </div>
  );
};

export default Charts;
