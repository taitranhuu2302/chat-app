import React, { useState } from 'react';
import styles from '@/styles/components/chat.module.scss';
import { IoIosAttach } from 'react-icons/io';
import { BiImage } from 'react-icons/bi';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { MdSend } from 'react-icons/md';
import useTranslate from '@/hooks/useTranslate';

interface IChatFooter {
  handleSendMessage: (message: string) => void;
}

const ChatFooter: React.FC<IChatFooter> = ({ handleSendMessage }) => {
  const t = useTranslate();
  const [text, setText] = useState('');
  
  const onSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (text.trim() === '') return;
    handleSendMessage(text);
    setText('');
  };
  
  return <form onSubmit={onSubmit}
               className={`${styles.chatFooter} border-t border-light-400 dark:border-night-400`}>
    <input type='text' placeholder={t.home.room.footer.inputMessageHint} value={text}
           onChange={(e) => setText(e.target.value)}
           className={'bg-via-500 dark:bg-via-300 w-full outline-none rounded-[6px] px-[16px] py-[8px]'} />
    <div className={'flex items-center gap-5'}>
      <button type={'button'} className={'tooltip tooltip-top'} data-tip={t.home.room.footer.emoji}>
        <HiOutlineEmojiHappy className={'text-primary'} size={20} />
      </button>
      <label htmlFor={'attached-file'} className={'cursor-pointer tooltip tooltip-top'}
             data-tip={t.home.room.footer.attachedFile}>
        <IoIosAttach className={'text-primary'} size={20} />
        <input type='file' id={'attached-file'} hidden />
      </label>
      <label htmlFor={'attached-image'} className={'cursor-pointer tooltip tooltip-top'}
             data-tip={t.home.room.footer.attachedImage}>
        <BiImage className={'text-primary'} size={22} />
        <input type='file' id={'attached-image'} hidden />
      </label>
      <button type={'submit'} className={'p-2.5 bg-primary flex-center rounded'}>
        <MdSend size={22} color={'white'} />
      </button>
    </div>
  </form>;
};

export default ChatFooter;