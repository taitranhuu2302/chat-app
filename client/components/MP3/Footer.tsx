import React, { PropsWithChildren, memo, useState } from 'react';
import Control from '@/components/MP3/Control';
import Volume from '@/components/MP3/Volume';
import { TbListDetails } from 'react-icons/tb';
import AudioModal from '@/components/MP3/Modal/AudioModal';
import ButtonHeart from "@/components/MP3/ButtonHeart";
import { useAppSelector } from '@/redux/hooks';
import { formatLimitText } from '@/utils/StringUtils';
import useTranslate from '@/hooks/useTranslate';

interface IProps {}

const Footer: React.FC<PropsWithChildren<IProps>> = memo(function Footer() {
  const [openAudioModal, setOpenAudioModal] = useState(false);
  const songCurrent = useAppSelector(state => state.music.songCurrent)
  const t = useTranslate()
  
  return (
    <>
      <div className={'flex items-center gap-2.5 px-5 h-[90px] bg-[#130c1c]'}>
        <div className={'flex items-center gap-5 w-[320px]'}>
          <picture>
            <img
              className={'w-[64px] h-[64px] rounded'}
              src={songCurrent?.thumbnailM || "https://static-zmp3.zadn.vn/skins/common/logo600.png"}
              alt=""
            />
          </picture>
          <div className='flex flex-col items-start gap-1'>
            <p className={'text-[14px] text-left font-semibold tooltip tooltip-top'} data-tip={songCurrent?.title || ""}>{formatLimitText(songCurrent?.title || "", 20)}</p>
            <p className={'text-caption text-left tooltip tooltip-top'} data-tip={songCurrent?.artistsNames}>{formatLimitText(songCurrent?.artistsNames || "", 30)}</p>
          </div>
          <div>
            {songCurrent && <ButtonHeart song={songCurrent}/>}
          </div>
        </div>
        <div className={'flex-grow flex-center'}>
          <div className={'max-w-[50vw] w-full'}>
            <Control />
          </div>
        </div>
        <div className={'flex-shrink flex items-center gap-3'}>
          <button className='tooltip tooltip-top' data-tip={t.showDetail} onClick={() => setOpenAudioModal(true)}>
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
});

export default Footer;
