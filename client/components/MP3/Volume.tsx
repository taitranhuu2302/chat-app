import React, { PropsWithChildren } from 'react';
import { IoVolumeHigh, IoVolumeMute } from 'react-icons/io5';
import Slider from '@/components/MP3/Slider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setVolume } from '@/redux/features/MusicSlice';

interface IProps {}

const Volume: React.FC<PropsWithChildren<IProps>> = () => {
  const volume = useAppSelector((state) => state.music.volume);
  const dispatch = useAppDispatch();

  return (
    <>
      <div className={'flex items-center gap-4'}>
        {volume <= 0 ? <IoVolumeMute size={25} /> : <IoVolumeHigh size={25} />}
        <div className={'w-[70px]'}>
          <Slider
            values={[volume]}
            step={0.1}
            max={1}
            setValues={(n: number[]) => {
              dispatch(setVolume(n[0]));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Volume;
