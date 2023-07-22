import React, {PropsWithChildren} from 'react';
import styles from '@/styles/components/music.module.scss'

interface IProps {

}

const MediaItem: React.FC<PropsWithChildren<IProps>> = () => {

  return <div className={styles.mediaItem}>
    <div className={'w-1/2 flex items-center gap-2.5'}>
      <p className={styles.mediaItemCount}>1</p>
      <div className={'flex items-center gap-2.5'}>
        <picture>
          <img className={'w-[40px] h-[40px] rounded object-cover'} src="https://photo-resize-zmp3.zmdcdn.me/w94_r1x1_webp/cover/6/d/9/6/6d961b2a82f151a0f9af7de928e8f809.jpg" alt=""/>
        </picture>
        <div>
          <p className={'text-[14px] font-medium'}>À Lôi</p>
          <p className={styles.textCaption}>
            Double2T, Masew
          </p>
        </div>
      </div>
    </div>
    <div className={'flex-grow'}>
      <p className={styles.textCaption}>À lôi (single)</p>
    </div>
    <div>
      <time className={styles.textCaption}>03:17</time>
    </div>
  </div>
}

export default MediaItem;