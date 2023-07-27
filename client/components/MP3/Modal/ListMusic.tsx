import React, { useEffect, useState } from 'react';
import SongItem from './SongItem';
import { useAppSelector } from '@/redux/hooks';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';

interface IProps {}

const ListMusic: React.FC<IProps> = () => {
  const { items: playlist } = useAppSelector((state) => state.music.playlist);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const songCurrent = useAppSelector((state) => state.music.songCurrent);

  useEffect(() => {
    if (!swiper) return;
    const index = playlist.findIndex(
      (item) => item.encodeId === songCurrent?.encodeId
    );
    if (index !== -1) {
      swiper.slideTo(index, 1000);
    }
  }, [songCurrent, swiper]);

  return (
    <>
      <div className={'h-full px-5'}>
        <Swiper
          className="h-full"
          onSwiper={setSwiper}
          spaceBetween={30}
          onActiveIndexChange={(swiper) => {
            setCurrentIndex(swiper.activeIndex);
          }}
          slidesPerView={'auto'}
          centeredSlides={true}>
          {playlist.map((song, index) => {
            return (
              <SwiperSlide
                key={song.encodeId}
                className={'!flex items-center !w-fit'}>
                <SongItem song={song} isActive={currentIndex === index} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default ListMusic;
