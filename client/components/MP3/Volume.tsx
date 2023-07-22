import React, { PropsWithChildren } from 'react';
import {IoVolumeHigh, IoVolumeMute} from 'react-icons/io5';
import Slider from "@/components/MP3/Slider";

interface IProps {}

const Volume: React.FC<PropsWithChildren<IProps>> = () => {
  return (
    <>
      <div className={'flex items-center gap-4'}>
        <IoVolumeHigh size={25}/>
        {/*<IoVolumeMute size={25}/>*/}
        <div className={'w-[70px]'}>
          <Slider />
        </div>
      </div>
    </>
  );
};

export default Volume;
