import React, { PropsWithChildren, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Control from '@/components/MP3/Control';
import Volume from '@/components/MP3/Volume';
import { TbListDetails } from 'react-icons/tb';
import AudioModal from '@/components/MP3/Modal/AudioModal';

interface IProps {}

const Footer: React.FC<PropsWithChildren<IProps>> = () => {
  const [isFavourite, setIsFavourite] = useState(false);
  const [openAudioModal, setOpenAudioModal] = useState(false);

  return (
    <>
      <div className={'flex items-center gap-2.5 px-5 h-[90px] bg-[#130c1c]'}>
        <div className={'flex items-center gap-5'}>
          <picture>
            <img
              className={'w-[64px] h-[64px] rounded'}
              src="https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp…over/2/d/5/c/2d5cc8bc9f930ce292c464e929ea31fb.jpg"
              alt=""
            />
          </picture>
          <div>
            <p className={'text-[14px] font-semibold'}>Bật tình yêu lên</p>
            <p className={'text-caption'}>Hoà Minzy</p>
          </div>
          <div>
            <button onClick={() => setIsFavourite((e) => !e)}>
              {isFavourite ? (
                <AiFillHeart className={'text-[#8b45ca]'} size={20} />
              ) : (
                <AiOutlineHeart size={20} />
              )}
            </button>
          </div>
        </div>
        <div className={'flex-grow flex-center'}>
          <Control />
        </div>
        <div className={'flex-shrink flex items-center gap-3'}>
          <button onClick={() => setOpenAudioModal(true)}>
            <TbListDetails size={25} />
          </button>
          <Volume />
        </div>
      </div>
      <AudioModal
        open={openAudioModal}
        onClose={() => setOpenAudioModal(false)}
      />
    </>
  );
};

export default Footer;
