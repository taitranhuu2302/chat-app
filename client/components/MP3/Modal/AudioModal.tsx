import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useContext, useMemo, useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { TAB_AUDIO_MODAL, TabAudioActiveType } from '@/constants/AudioModal';
import { twMerge } from 'tailwind-merge';
import Control from '@/components/MP3/Control';
import ListMusic from '@/components/MP3/Modal/ListMusic';
import Lyrics from '@/components/MP3/Modal/Lyrics';
import { useAppSelector } from '@/redux/hooks';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const AudioModal: React.FC<IProps> = memo(function AudioModal({
  open,
  onClose,
}) {
  const [tabActive, setTabActive] = useState<TabAudioActiveType>('Lyric');
  const songCurrent = useAppSelector((state) => state.music.songCurrent);

  const styleActive = (isActive: boolean) =>
    isActive ? 'active-soft' : 'hidden-soft';

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3 }}
            className={'fixed top-0 left-0 w-full h-full'}>
            <AudioModalBG />
            <div className={'relative z-10 h-full flex flex-col'}>
              <div className={'flex p-5 flex-wrap'}>
                <div className={'flex-grow'}>
                  <picture>
                    <img
                      src="https://zjs.zmdcdn.me/zmp3-desktop/dev/119956/static/media/icon_zing_mp3_60.f6b51045.svg"
                      alt=""
                      className={'w-[45px] h-[45px]'}
                    />
                  </picture>
                </div>
                <div className={'flex-grow flex-center'}>
                  <ul
                    className={
                      'rounded-full w-fit flex gap-2 bg-opacity-ct p-1'
                    }>
                    {TAB_AUDIO_MODAL.map((item) => (
                      <li
                        key={item.id}
                        className={twMerge(
                          'color-opacity-ct cursor-pointer py-[3px] px-[10px] md:px-[50px] w-fit rounded-full font-bold',
                          tabActive === item.type && 'bg-opacity-ct--active'
                        )}
                        onClick={() => setTabActive(item.type)}>
                        {item.name}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={'flex-grow flex items-center justify-end'}>
                  <button
                    className={
                      'bg-opacity-ct rounded-full pt-[2px] w-[45px] h-[45px] flex-center hover:opacity-80'
                    }
                    onClick={onClose}>
                    <FiChevronDown size={30} color={'white'} />
                  </button>
                </div>
              </div>
              <div className={'flex-grow flex'}>
                <div
                  className={twMerge(
                    'h-full w-full',
                    styleActive(tabActive === 'List')
                  )}>
                  <ListMusic />
                </div>
                <div
                  className={twMerge(
                    'h-full w-full',
                    styleActive(tabActive === 'Lyric')
                  )}>
                  <Lyrics />
                </div>
              </div>
              <div className={'py-5 px-2.5 flex-center flex-col'}>
                {songCurrent && (
                  <div className={'mb-2 flex-center gap-2.5'}>
                    <p className={'text-center font-semibold text-white'}>
                      {songCurrent?.title}
                    </p>
                    <div
                      className={
                        'w-[5px] h-[5px] rounded-full bg-[#CACECC]'
                      }></div>
                    <p className={'font-semibold text-[#AFB6B2]'}>
                      {songCurrent?.artistsNames}
                    </p>
                  </div>
                )}
                <div className={'flex-center gap-5 max-w-[500px] w-full mb-2'}>
                  <Control />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

const AudioModalBG = () => {
  const songCurrent = useAppSelector((state) => state.music.songCurrent);
  return (
    <div className={'absolute top-0 left-0 w-full h-full'}>
      <div
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'rgba(41,21,71,0.8)',
          position: 'absolute',
          backdropFilter: 'blur(20px)',
          zIndex: 2,
        }}></div>
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundImage: `url(${
            songCurrent?.thumbnailM ?? 'https://photo-resize-zmp3.zmdcdn.me/'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}></div>
    </div>
  );
};

export default AudioModal;
