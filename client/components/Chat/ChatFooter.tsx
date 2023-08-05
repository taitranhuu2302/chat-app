import useTranslate from '@/hooks/useTranslate';
import { setReplyMessage } from '@/redux/features/MessageSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import styles from '@/styles/components/chat.module.scss';
import { ALLOWED_TYPES, getFileType } from '@/utils/FileUtils';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import GifPicker from 'gif-picker-react';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { BsFillFileTextFill } from 'react-icons/bs';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { HiGif } from 'react-icons/hi2';
import { IoIosAttach } from 'react-icons/io';
import { IoClose, IoText } from 'react-icons/io5';
import { MdSend } from 'react-icons/md';
import { useDebounce, useOnClickOutside } from 'usehooks-ts';
import Editor from '../Editor';
import { useSearchSong } from '@/service/MusicService';
import SongSearchItem from '@/components/MP3/SongSearchItem';
import SearchSongSkeleton from '@/components/MP3/SearchSongSkeleton';

interface IChatFooter {
  handleSendMessage: (payload: MessageCreateType) => void;
  isLoadingSendMessage: boolean;
  onTextChange: (text: string) => void;
}

const ChatFooter: React.FC<IChatFooter> = ({
  handleSendMessage,
  onTextChange,
  isLoadingSendMessage,
}) => {
  const t: any = useTranslate();
  const [text, setText] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [format, setFormat] = useState(false);
  const router = useRouter();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [openGif, setOpenGif] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [gifs, setGifs] = useState<string[]>([]);
  const fileAttachRef = useRef<any>(null);
  const { reply } = useAppSelector((state) => state.message);
  const dispatch = useAppDispatch();
  const [chooseSongs, setChooseSongs] = useState<SongInfoType[]>([]);
  const [keywordSearchSong, setKeywordSearchSong] = useState('');
  const keywordSearchSongDebounce = useDebounce(keywordSearchSong, 500);
  const [searchSongs, setSearchSongs] = useState<SongInfoType[]>([]);
  const { isLoading } = useSearchSong({
    keyword: keywordSearchSongDebounce,
    options: {
      onSuccess: ({ data }: { data: SearchType }) => {
        data.songs && setSearchSongs(data.songs);
      },
    },
  });
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
      reply: reply ? reply._id : undefined,
      songs: chooseSongs
    });
    setText('');
    setFiles([]);
    setGifs([]);
    setChooseSongs([])
    dispatch(setReplyMessage(null));
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

  const handleChangeText = (text: string) => {
    setText(text);
    onTextChange(text);
    if (text.includes('@music/')) {
      const arrText = text.split('@music/');

      if (arrText.length < 2) {
        setSearchSongs([]);
        return;
      }
      const matchText = arrText[1].match(/^([\w-]+)/);
      if (!matchText) {
        setSearchSongs([]);
        return;
      }
      const songName = matchText[1];
      setKeywordSearchSong(songName.split('-').join(' '));
    } else {
      setSearchSongs([]);
    }
  };

  const onToggleSong = (song: SongInfoType, type: 'ADD' | 'REMOVE') => {
    if (type === 'ADD') {
      const check = chooseSongs.find((s) => s.encodeId === song.encodeId);
      if (check) return;
      setChooseSongs((s) => [...s, song]);
      return;
    }

    if (type === 'REMOVE') {
      setChooseSongs((s) => [
        ...s.filter((item) => item.encodeId !== song.encodeId),
      ]);
      return;
    }
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
      {(!!searchSongs.length || !!chooseSongs.length) && (
        <div
          className={`absolute w-[calc(100%_-_20px)] space-y-2 bottom-[110%] left-1/2 -translate-x-1/2`}>
          {!!chooseSongs.length && (
            <ul
              className={
                'flex flex-col scrollbar overflow-y-auto max-h-[200px] rounded-lg shadow-lg bg-[#34224f] p-2'
              }>
              {chooseSongs.map((song) => (
                <SongSearchItem
                  callback={(song) => {}}
                  isHeart={false}
                  onDeleteCallback={(song) => onToggleSong(song, 'REMOVE')}
                  key={song.encodeId}
                  song={song}
                />
              ))}
            </ul>
          )}
          {!!searchSongs.length && (
            <ul
              className={
                'flex flex-col scrollbar overflow-y-auto max-h-[200px] rounded-lg shadow-lg bg-[#34224f] p-2'
              }>
              {isLoading &&
                Array(5)
                  .fill(0)
                  .map((_, index) => {
                    return <SearchSongSkeleton key={index} />;
                  })}
              {searchSongs.map((song) => (
                <SongSearchItem
                  callback={(song) => onToggleSong(song, 'ADD')}
                  isHeart={false}
                  key={song.encodeId}
                  song={song}
                />
              ))}
            </ul>
          )}
        </div>
      )}
      {reply && (
        <div className={'relative'}>
          <p className={'text-md font-medium'}>
            {t.answering} {reply.sender.firstName} {reply.sender.lastName}
          </p>
          {reply.text && (
            <div
              className={'text-sm un-reset line-clamp-1'}
              dangerouslySetInnerHTML={{ __html: reply.text }}></div>
          )}
          {reply.file && <p className={'text-xs'}>{getFileType(reply.file)}</p>}
          <button
            onClick={() => dispatch(setReplyMessage(null))}
            className={'absolute top-0 right-0'}>
            <IoClose size={20} />
          </button>
        </div>
      )}
      <div className={'flex gap-5 w-full'}>
        <div className="flex-grow">
          <Editor
            editorLoaded={editorLoaded}
            onChange={handleChangeText}
            handleSubmit={handleSubmit}
            value={text}
            showTopEditor={format}
          />
        </div>
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
