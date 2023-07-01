import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { BsFillFileTextFill } from 'react-icons/bs';
import { ALLOWED_TYPES } from '@/utils/FileUtils';
import GifPicker from 'gif-picker-react';
import { HiGif } from 'react-icons/hi2';

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
  const [openGif, setOpenGif] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [gifs, setGifs] = useState<string[]>([]);
  const fileAttachRef = useRef<any>(null);
  const gifRef = useRef<any>(null);
  const {
    query: { id },
  } = router;
  const buttonEmojiRef = useRef<any>(null);
  useOnClickOutside(buttonEmojiRef, () => {
    setOpenEmoji(false);
  });
  useOnClickOutside(gifRef, () => {
    setOpenGif(false);
  });
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
      files,
      gifs,
    });
    setText('');
    setFiles([]);
    setGifs([]);
  };

  const handleChangeAttachFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const fileList = target.files;
    if (!fileList) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file) continue;
      const splitFileName = file.name.split('.');
      if (
        !ALLOWED_TYPES.includes(`.${splitFileName[splitFileName.length - 1]}`)
      )
        continue;
      setFiles((f) => [...f, file]);
    }
  };

  const handleDeleteFile = (index: number) => {
    const temp = files;
    temp.splice(index, 1);
    setFiles([...temp]);
  };

  const handleDeleteGif = (index: number) => {
    const temp = gifs;
    temp.splice(index, 1);
    setGifs([...temp]);
  };

  return (
    <div
      className={`${styles.chatFooter} border-t border-light-400 dark:border-night-400 relative`}>
      {(!!files.length || !!gifs.length) && (
        <div
          className={`absolute scrollbar w-[calc(100%_-_20px)] rounded-lg overflow-x-auto gap-2.5 min-h-[140px] flex items-center shadow-lg border dark:border-none p-2 bg-white dark:bg-via-300 bottom-[110%] left-1/2 -translate-x-1/2`}>
          {gifs.map((gif, index) => (
            <picture key={index} className={`min-w-fit relative`}>
              <img src={gif} alt="" className={`h-[120px] min-w-fit rounded`} />
              <ButtonClose onClick={() => handleDeleteGif(index)} />
            </picture>
          ))}
          {files.map((file, index) => {
            if (!file) return null;
            if (file.type.includes('image')) {
              return (
                <picture key={index} className={`min-w-fit relative`}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className={`h-[120px] min-w-fit rounded`}
                  />
                  <ButtonClose onClick={() => handleDeleteFile(index)} />
                </picture>
              );
            }
            if (file.type.includes('video')) {
              return (
                <>
                  <div className={'h-[120px] min-w-[200px] relative'}>
                    <video
                      autoPlay={true}
                      muted={true}
                      className={'object-cover h-[120px] rounded'}
                      src={URL.createObjectURL(file)}></video>
                    <ButtonClose onClick={() => handleDeleteFile(index)} />
                  </div>
                </>
              );
            }

            return (
              <div
                key={index}
                className={
                  'h-[120px] gap-2.5 flex-center rounded min-w-[200px] bg-gray-300 px-3 truncate relative'
                }>
                <div>
                  <BsFillFileTextFill size={40} />
                </div>
                <p>
                  {file.name.length > 20
                    ? `${file.name.substring(0, 19)}...`
                    : file.name}
                </p>
                <ButtonClose onClick={() => handleDeleteFile(index)} />
              </div>
            );
          })}
        </div>
      )}
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
            onClick={() => setOpenEmoji((e) => !e)}
            className={'tooltip tooltip-top'}
            data-tip={t.home.room.footer.emoji}>
            <HiOutlineEmojiHappy className={'text-primary'} size={22} />
          </button>
          {openEmoji && (
            <div className={'absolute bottom-full right-0'}>
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  setText((t) => `${t}${emoji.native}`);
                }}
              />
            </div>
          )}
        </div>
        <div className={'relative flex-center'} ref={gifRef}>
          <button
            type={'button'}
            className={'tooltip tooltip-top'}
            onClick={() => setOpenGif((g) => !g)}
            data-tip={'Gif'}>
            <HiGif className={'text-primary'} size={20} />
          </button>
          <div className={'absolute bottom-full right-0'}>
            {openGif && (
              <GifPicker
                onGifClick={(gif) => {
                  setGifs((g) => [...g, gif.url]);
                }}
                tenorApiKey={process.env.GOOGLE_API_KEY || ''}
              />
            )}
          </div>
        </div>
        <label
          htmlFor={'attached-file'}
          className={'cursor-pointer tooltip tooltip-top'}
          data-tip={t.home.room.footer.attachedFile}>
          <IoIosAttach className={'text-primary'} size={20} />
          <input
            type="file"
            id={'attached-file'}
            hidden
            multiple
            ref={fileAttachRef}
            onChange={handleChangeAttachFile}
            formEncType={
              'image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx'
            }
          />
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

const ButtonClose = ({ onClick }: { onClick?: () => void }) => {
  return (
    <button
      onClick={() => onClick && onClick()}
      className="btn btn-circle absolute top-2 right-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default ChatFooter;
