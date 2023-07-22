import React, { FC } from 'react';

interface ISongItem {
}

const SongItem: FC<ISongItem> = ({}) => {
  return (
    <div className={'flex flex-col items-center justify-center'}>
      <div className={'w-[400px] h-[400px]'}>
        <picture>
          <img
            src={'https://photo-resize-zmp3.zmdcdn.me/'}
            alt=""
            className={'object-cover w-full h-full rounded-lg'}
          />
        </picture>
      </div>
      <div className={'flex-center mt-5 flex flex-col'}>
        <p className={'text-[24px] font-bold text-white'}>Name</p>
        <p className={'text-[14px] mb-1 text-[hsla(0,0%,100%,.8)]'}>
          Artists Names
        </p>
      </div>
    </div>
  );
};

export default SongItem;
