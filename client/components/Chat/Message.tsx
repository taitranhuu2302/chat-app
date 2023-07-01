import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import Avatar from 'react-avatar';
import {
  BsFillFileTextFill,
  BsReplyFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import moment from 'moment';
import 'moment/locale/vi';
import { getFileType } from '@/utils/FileUtils';
import { twMerge } from 'tailwind-merge';
import { FaPlay } from 'react-icons/fa';
import Portal from '@/components/Portal';
import useTranslate from '@/hooks/useTranslate';
import ConfirmDelete from '@/components/Dialog/ConfirmDelete';
import { useDeleteMessageApi } from '@/service/MessageService';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import { getErrorResponse } from '@/utils/ErrorUtils';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';

interface IMessage {
  isOwner?: boolean;
  message: MessageType;
  isFirst?: boolean;
  isSameOwner?: boolean;
  isLastSame?: boolean;
}

const Message: React.FC<IMessage> = ({
  isOwner,
  message,
  isFirst,
  isSameOwner,
  isLastSame,
}) => {
  const t: any = useTranslate();
  const { mutateAsync: deleteMessage, isLoading: deleteMessageLoading } =
    useDeleteMessageApi();
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch(onPageLoading(deleteMessageLoading));
  }, [deleteMessageLoading]);

  const renderFile = useMemo(() => {
    if (!message.file || getFileType(message.file) === 'unknown') return null;
    if (getFileType(message.file) === 'image') {
      return (
        <picture>
          <img
            data-fancybox={message.conversation._id}
            className={
              'max-w-[200px] border cursor-pointer rounded-lg object-cover'
            }
            src={message.file}
            alt=""
          />
        </picture>
      );
    }
    if (getFileType(message.file) === 'video') {
      return (
        <>
          <div
            className={
              'max-w-[200px] border cursor-pointer rounded-lg object-cover'
            }>
            <VideoPlayer src={message.file} />
          </div>
        </>
      );
    }

    if (getFileType(message.file) === 'docs') {
      const fileSplit = message.file.split('/');
      const fileName = fileSplit[fileSplit.length - 1];
      return (
        <>
          <div
            onClick={() => {
              window.open(message.file, '_blank');
            }}
            className={
              'gap-2.5 flex cursor-pointer items-center rounded w-fit max-w-[200px] bg-gray-300 p-3 overflow-hidden relative'
            }>
            <div>
              <BsFillFileTextFill size={30} />
            </div>
            <p className={'line-clamp-1'}>
              {fileName.length > 20
                ? `${fileName.substring(0, 19)}...`
                : fileName}
            </p>
          </div>
        </>
      );
    }
  }, [message.file]);

  const handleDeleteMessage = useCallback(async () => {
    try {
      await deleteMessage(message._id);
      toast.success('Delete message successfully');
    } catch (e: any) {
      const errors = getErrorResponse(e.message);
      toast.error(errors[0]);
    } finally {
      setOpenDelete(false);
    }
  }, [message]);

  return (
    <>
      <div className={`chat ${isOwner ? 'chat-end' : 'chat-start'}`}>
        <div className="chat-image avatar">
          <Avatar
            size={'40px'}
            src={message.sender.avatar || ''}
            round
            name={`${message.sender.firstName} ${message.sender.lastName}`}
          />
        </div>
        {!isSameOwner && (
          <div
            className={`chat-header mb-1 gap-2.5 flex items-center ${
              isOwner ? 'flex-row-reverse' : ''
            }`}>
            <span
              className={
                'font-semibold'
              }>{`${message.sender.firstName} ${message.sender.lastName}`}</span>
            {/*<time className="text-xs opacity-50">*/}
            {/*  {moment(message.updatedAt).locale('vi').format('LT')}*/}
            {/*</time>*/}
          </div>
        )}
        <div
          className={twMerge(
            `chat-bubble ${
              isOwner
                ? 'bg-via-500 dark:bg-via-300 text-light-1100 dark:text-night-1100'
                : 'bg-primary text-light'
            } relative max-w-[50%]`,
            message.file && 'bg-transparent p-0'
          )}>
          {message.text && (
            <div
              className={`tooltip un-reset ${
                isOwner ? 'tooltip-left' : 'tooltip-right'
              }`}
              data-tip={moment(message.updatedAt).locale('en').format('LLL')}
              dangerouslySetInnerHTML={{ __html: message.text }}
            />
          )}
          {message.file && (
            <div
              className={`tooltip un-reset ${
                isOwner ? 'tooltip-left' : 'tooltip-right'
              }`}
              data-tip={moment(message.updatedAt).locale('en').format('LLL')}>
              {renderFile}
            </div>
          )}
          <div
            className={`absolute dropdown ${
              isFirst ? 'dropdown-bottom' : 'dropdown-top'
            } ${
              isOwner
                ? 'left-[-15px] dropdown-left'
                : 'right-[-15px] dropdown-right'
            } top-0`}>
            <button tabIndex={0}>
              <BsThreeDotsVertical size={15} className={'text-primary'} />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-light dark:bg-via-300 rounded-box w-52 z-10">
              <li>
                <a
                  className={
                    'flex items-center justify-between text-light-1100 dark:text-night-1100'
                  }>
                  <span>Reply</span>
                  <BsReplyFill size={20} />
                </a>
              </li>
              {isOwner && (
                <li>
                  <a
                    onClick={() => setOpenDelete(true)}
                    className={
                      'flex items-center justify-between text-light-1100 dark:text-night-1100'
                    }>
                    <span>Delete</span>
                    <MdOutlineDelete size={22} />
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <ConfirmDelete
        isOpen={openDelete}
        title={t.confirmDelete}
        message={t.descDeleteMessage}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDeleteMessage}
      />
    </>
  );
};

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const togglePlay = () => {
    const videoElement = videoRef.current;

    if (videoElement && !isFullscreen) {
      if (videoElement.paused) {
        videoElement.play();
      } else {
        videoElement.pause();
      }

      setIsPlaying(!isPlaying);
    }
  };

  const enterFullscreen = () => {
    const videoElement = videoRef.current;

    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen();
        // @ts-ignore
      } else if (videoElement.mozRequestFullScreen) {
        // @ts-ignore
        videoElement.mozRequestFullScreen();
        // @ts-ignore
      } else if (videoElement.webkitRequestFullscreen) {
        // @ts-ignore
        videoElement.webkitRequestFullscreen();
        // @ts-ignore
      } else if (videoElement.msRequestFullscreen) {
        // @ts-ignore
        videoElement.msRequestFullscreen();
      }

      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        // @ts-ignore
        document.mozFullScreenElement ||
        // @ts-ignore
        document.webkitFullscreenElement ||
        // @ts-ignore
        document.msFullscreenElement;

      setIsFullscreen(!!fullscreenElement);
      console.log('Fullscreen change');
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'mozfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
      document.removeEventListener(
        'msfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  const handleDoubleClick = () => {
    enterFullscreen();
  };

  return (
    <div className="relative" onDoubleClick={handleDoubleClick}>
      <video
        ref={videoRef}
        src={src}
        className="rounded-lg"
        autoPlay={false}
        onClick={togglePlay}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPause={() => {
          setIsPlaying(false);
        }}></video>
      {!isPlaying && (
        <div className="position-center">
          <FaPlay color="white" size={30} onClick={togglePlay} />
        </div>
      )}
    </div>
  );
};
export default Message;
