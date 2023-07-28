import React, { FC, useEffect, useMemo, useState } from 'react';
import { formatLimitText } from '@/utils/StringUtils';
import ButtonHeart from '@/components/MP3/ButtonHeart';
import { BsPauseCircle, BsPlayCircle } from 'react-icons/bs';
import TextBouncing from '@/components/TextBouncing';
import { twMerge } from 'tailwind-merge';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setIsPlaying, setSongCurrent } from '@/redux/features/MusicSlice';

interface ISongItem {
  song: SongInfoType;
  isActive?: boolean;
}

const SongItem: FC<ISongItem> = ({ song, isActive }) => {
  const [isHoverImage, setIsHoverImage] = useState(false);
  const songCurrent = useAppSelector((state) => state.music.songCurrent);
  const [isSongCurrent, setIsSongCurrent] = useState(false);
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector((state) => state.music.isPlaying);

  useEffect(() => {
    setIsSongCurrent(song.encodeId === songCurrent?.encodeId);
  }, [songCurrent, song]);

  const renderIconPlay = useMemo(() => {
    if (!isSongCurrent) {
      return <BsPlayCircle size={50} />;
    }
    if (isPlaying) {
      return <BsPauseCircle size={50} />;
    }
    return <BsPlayCircle size={50} />;
  }, [isSongCurrent, isPlaying]);

  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center transition-all duration-500',
        isSongCurrent && 'scale-[1.1]'
      )}>
      <div
        className={'relative'}
        onMouseOver={() => setIsHoverImage(true)}
        onMouseOut={() => setIsHoverImage(false)}>
        {isHoverImage && (
          <div
            className={'absolute top-0 left-0 right-0 bottom-0 rounded-lg'}
            style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className={'flex-center h-full'}>
              <>
                <ButtonHeart song={song} />
                <button
                  onClick={() => {
                    if (!isSongCurrent) {
                      dispatch(setSongCurrent(song));
                      return;
                    }

                    dispatch(setIsPlaying(null));
                  }}>
                  {renderIconPlay}
                </button>
                <div className={'opacity-0 invisible'}>
                  <ButtonHeart song={song} />
                </div>
              </>
            </div>
          </div>
        )}
        <picture>
          <img
            src={song?.thumbnailM || 'https://photo-resize-zmp3.zmdcdn.me/'}
            alt=""
            className={twMerge(
              'object-cover w-full h-full rounded-lg',
              isActive && 'border-2 border-white'
            )}
          />
        </picture>
      </div>
      <div className={'flex-center mt-5 flex flex-col'}>
        <p
          className={'text-[20px] font-bold text-white tooltip tooltip-top'}
          data-tip={song?.title}>
          {formatLimitText(song?.title!, 15) || 'Name'}
        </p>
        <p
          className={
            'text-[14px] mb-1 text-[hsla(0,0%,100%,.8)] tooltip tooltip-top'
          }
          data-tip={song?.artistsNames}>
          {formatLimitText(song?.artistsNames!, 20) ?? 'Artists Names'}
        </p>
      </div>
    </div>
  );
};

export default SongItem;
