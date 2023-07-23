import React, { PropsWithChildren } from 'react';
import styles from '@/styles/components/music.module.scss';
import ButtonHeart from '@/components/MP3/ButtonHeart';
import Skeleton from 'react-loading-skeleton';

interface IProps {}

const MediaItemSkeleton: React.FC<PropsWithChildren<IProps>> = () => {
  return (
    <>
      <div className={styles.mediaItem}>
        <div className={'w-1/2 flex items-center gap-2.5'}>
          <div className={'min-w-[65px] flex-center'}>
            <Skeleton width={25} height={30} />
          </div>
          <div className={'flex items-center gap-2.5'}>
            <Skeleton width={40} height={40} />
            <div>
              <Skeleton width={50} height={10} />
              <Skeleton width={100} height={10} />
            </div>
          </div>
        </div>
        <div className={'flex-grow'}>
          <Skeleton width={100} height={10} />
        </div>
        <div className={'flex items-center gap-5'}>
          <Skeleton width={20} height={20} />
          <Skeleton width={40} height={10} />
        </div>
      </div>
    </>
  );
};

export default MediaItemSkeleton;
