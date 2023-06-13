import React from 'react';
import styles from '@/styles/components/chat.module.scss';
import Avatar from 'react-avatar';
import {BsCameraVideo, BsThreeDots} from 'react-icons/bs';
import {AiOutlineUser} from 'react-icons/ai';
import ModalCallAudio from '../Modals/ModalCallAudio';
import ModalCallVideo from '@/components/Modals/ModalCallVideo';
import useTranslate from '@/hooks/useTranslate';
import {IoIosArrowBack} from 'react-icons/io';
import {useRouter} from 'next/router';

interface IChatHeader {
  onToggleSidebar: () => void;
}

const ChatHeader: React.FC<IChatHeader> = ({ onToggleSidebar }) => {
  const t = useTranslate();
  const router = useRouter();
  
  return <div className={`${styles.chatHeader} border-b border-solid border-light-400 dark:border-night-400`}>
    <div className={styles.chatHeaderLeft}>
      <button onClick={() => router.push({
        pathname: '/',
        query: { tab: router.query.tab || '' },
      })} className={'lg:hidden'}>
        <IoIosArrowBack size={20} />
      </button>
      <Avatar name={'Tran Huu Tai'} size={'40px'} round />
      <p className={'text-md font-semibold'}>Tran Huu Tai</p>
    </div>
    <div className={styles.chatHeaderRight}>
      <label data-tip={t.home.room.header.videoCall.label} className={'tooltip tooltip-bottom cursor-pointer'} htmlFor={'modal-call-video'}><BsCameraVideo size={22} /></label>
      <button data-tip={t.home.room.header.profile} className={'tooltip tooltip-bottom'} onClick={onToggleSidebar}>
        <AiOutlineUser size={22} /></button>
      <div className={'dropdown dropdown-left'}>
        <button data-tip={t.home.room.header.more.label} className={'tooltip tooltip-left'} tabIndex={0}><BsThreeDots
          size={22} /></button>
        <ul tabIndex={0} className={'dropdown-content menu p-2 shadow bg-light dark:bg-via-300 rounded-box w-52'}>
          <li><a>{t.home.room.header.more.archive}</a></li>
          <li><a>{t.home.room.header.more.mute}</a></li>
          <li><a>{t.home.room.header.more.delete}</a></li>
        </ul>
      </div>
    </div>
  </div>;
};

export default ChatHeader;