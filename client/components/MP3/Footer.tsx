import React, { PropsWithChildren, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import Control from '@/components/MP3/Control';
import Volume from '@/components/MP3/Volume';
import { TbListDetails } from 'react-icons/tb';
import AudioModal from '@/components/MP3/Modal/AudioModal';
import ButtonHeart from "@/components/MP3/ButtonHeart";
import { useAppSelector } from '@/redux/hooks';
import { formatLimitText } from '@/utils/StringUtils';

interface IProps {}

const Footer: React.FC<PropsWithChildren<IProps>> = () => {
  const [openAudioModal, setOpenAudioModal] = useState(false);
  const songCurrent = useAppSelector(state => state.music.songCurrent)

  return (
    <>
      <div className={'flex items-center gap-2.5 px-5 h-[90px] bg-[#130c1c]'}>
        <div className={'flex items-center gap-5'}>
          <picture>
            <img
              className={'w-[64px] h-[64px] rounded'}
              src={songCurrent?.thumbnailM || "https://static-zmp3.zadn.vn/skins/common/logo600.png"}
              alt=""
            />
          </picture>
          <div className='flex flex-col items-start gap-1'>
            <p className={'text-[14px] font-semibold tooltip tooltip-top'} data-tip={songCurrent?.title || ""}>{formatLimitText(songCurrent?.title || "", 20)}</p>
            <p className={'text-caption tooltip tooltip-top'} data-tip={songCurrent?.artistsNames}>{formatLimitText(songCurrent?.artistsNames || "", 30)}</p>
          </div>
          <div>
            <ButtonHeart />
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
