import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from '@/styles/components/chat.module.scss';
import { IoIosAttach } from 'react-icons/io';
import { BiImage } from 'react-icons/bi';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { MdSend } from 'react-icons/md';
import useTranslate from '@/hooks/useTranslate';
import Editor from '../Editor';
import { IoText } from 'react-icons/io5';
import { useRouter } from 'next/router';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useOnClickOutside } from 'usehooks-ts';

interface IChatFooter {
  handleSendMessage: (payload: MessageCreateType) => void;
  isLoadingSendMessage: boolean;
}

const ChatFooter: React.FC<IChatFooter> = ({
  handleSendMessage,
  isLoadingSendMessage,
}) => {
  const t = useTranslate();
  const [text, setText] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [format, setFormat] = useState(false);
  const router = useRouter();
  const [openEmoji, setOpenEmoji] = useState(false);
  const {
    query: { id },
  } = router;
  const buttonEmojiRef = useRef<any>(null)
  useOnClickOutside(buttonEmojiRef, () => {
    setOpenEmoji(false)
  })
  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  const handleSubmit = () => {
    if (isLoadingSendMessage) {
      return;
    }
    handleSendMessage({
      text,
      conversation: id as string,
    });
    setText('');
  };

  return (
    <div
      className={`${styles.chatFooter} border-t border-light-400 dark:border-night-400`}>
      {/*<input type='text' placeholder={t.home.room.footer.inputMessageHint} value={text}*/}
      {/*       onChange={(e) => setText(e.target.value)}*/}
      {/*       className={'bg-via-500 dark:bg-via-300 w-full outline-none rounded-[6px] px-[16px] py-[8px]'} />*/}
      <Editor
        editorLoaded={editorLoaded}
        onChange={setText}
        handleSubmit={handleSubmit}
        value={text}
        showTopEditor={format}
      />
      <div className={'flex items-center gap-5'}>
        <button
          type={'button'}
          className={'tooltip tooltip-top'}
          onClick={() => setFormat((f) => !f)}
          data-tip={'Format'}>
          <IoText className={'text-primary'} size={20} />
        </button>
        <div className={'relative flex-center'} ref={buttonEmojiRef}>
          <button
            type={'button'}
            onClick={() => setOpenEmoji(e => !e)}
            className={'tooltip tooltip-top'}
            data-tip={t.home.room.footer.emoji}>
            <HiOutlineEmojiHappy className={'text-primary'} size={22} />
          </button>
          {
            openEmoji && (
              <div className={'absolute bottom-full right-0'}>
                <Picker data={data} onEmojiSelect={(emoji: any) => {
                  setText(t => `${t}${emoji.native}`)
                }} />
              </div>
            )
          }
        </div>
        <label
          htmlFor={'attached-file'}
          className={'cursor-pointer tooltip tooltip-top'}
          data-tip={t.home.room.footer.attachedFile}>
          <IoIosAttach className={'text-primary'} size={20} />
          <input type="file" id={'attached-file'} hidden />
        </label>
        <label
          htmlFor={'attached-image'}
          className={'cursor-pointer tooltip tooltip-top'}
          data-tip={t.home.room.footer.attachedImage}>
          <BiImage className={'text-primary'} size={22} />
          <input type="file" id={'attached-image'} hidden />
        </label>
        <button
          type={'button'}
          onClick={handleSubmit}
          className={'p-2.5 bg-primary flex-center rounded'}>
          <MdSend size={22} color={'white'} />
        </button>
      </div>
    </div>
  );
};

export default ChatFooter;
