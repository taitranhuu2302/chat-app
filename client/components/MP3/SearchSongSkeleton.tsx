import React, { PropsWithChildren } from 'react';
import Skeleton from 'react-loading-skeleton';

interface IProps {}

const SearchSongSkeleton: React.FC<PropsWithChildren<IProps>> = () => {
  return (
    <>
      <li
        className={
          'p-2.5 hover:bg-[#493961] rounded flex items-center justify-between'
        }>
        <div className={'flex items-center gap-2.5'}>
          <Skeleton width={52} height={52} />
          <div className={'flex justify-center items-center gap-2 flex-col'}>
            <Skeleton width={100} height={20} />
            <Skeleton width={100} height={15} />
          </div>
        </div>
        <Skeleton width={20} height={20} />
      </li>
    </>
  );
};

export default SearchSongSkeleton;