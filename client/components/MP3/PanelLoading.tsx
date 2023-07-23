import React, {PropsWithChildren} from 'react';
import {BsFillPlayCircleFill} from "react-icons/bs";
import MediaItemSkeleton from "@/components/MP3/Modal/MediaItemSkeleton";
import MediaItem from "@/components/MP3/MediaItem";
import Skeleton from "react-loading-skeleton";

interface IProps {

}

const PanelLoading: React.FC<PropsWithChildren<IProps>> = () => {

  return <>
    <div className={'h-full flex flex-col overflow-auto relative'}>
      <div className={'flex items-center gap-3'}>
        <p className={'text-3xl tracking-wide text-white font-bold'}>
          <Skeleton width={100} height={20}/>
        </p>
        <button>
          <BsFillPlayCircleFill size={30} color={'white'}/>
        </button>
      </div>
      <div className={'space-y-2.5 py-2.5'}>
        {Array(20)
        .fill(0)
        .map((_, index) => <MediaItemSkeleton key={index}/>)}
      </div>
    </div>
  </>
}

export default PanelLoading;