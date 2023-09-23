import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Avatar from 'react-avatar';
import {
  BsFillFileTextFill,
  BsReplyFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import moment from 'moment';
import 'moment/locale/vi';
import { getFileType } from '@/utils/FileUtils';
import { twMerge } from 'tailwind-merge';
import useTranslate from '@/hooks/useTranslate';
import ConfirmDelete from '@/components/Dialog/ConfirmDelete';
import { useDeleteMessageApi } from '@/service/MessageService';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import { getErrorResponse } from '@/utils/ErrorUtils';
import toast from 'react-hot-toast';
import { setReplyMessage } from '@/redux/features/MessageSlice';
import styles from '@/styles/components/chat.module.scss';
import VideoPlayer from './VideoPlayer';
import eventBus from '@/config/EventBus';
import SongMessage from '@/components/Chat/SongMessage';
import { EDITOR_FOCUS } from '@/constants/Chat';
import Reactions from '@/components/Chat/Reactions';

interface IMessage {
  isOwner?: boolean;
  message: MessageType;
  isFirst?: boolean;
  isSameOwner?: boolean;
  isLastSame?: boolean;
  scrollToMessageReply?: (message: MessageType) => void;
  messageReplyActive?: MessageType | null;
}

const Message = React.forwardRef<HTMLDivElement, IMessage>(
  (
    {
      isOwner,
      message,
      isFirst,
      isSameOwner,
      isLastSame,
      messageReplyActive,
      scrollToMessageReply,
    },
    ref
  ) => {
    const t: any = useTranslate();
    const { mutateAsync: deleteMessage, isLoading: deleteMessageLoading } =
      useDeleteMessageApi();
    const [openDelete, setOpenDelete] = useState(false);
    const dispatch = useAppDispatch();
    const songMessage = message.song ? JSON.parse(message.song) : null;

    useEffect(() => {
      dispatch(onPageLoading(deleteMessageLoading));
    }, [deleteMessageLoading]);

    const renderFile = useMemo(() => {
      if (!message.file || getFileType(message.file) === 'unknown') return null;
      if (getFileType(message.file) === 'image') {
        return (
          <picture>
            <img
              data-fancybox={(message.conversation as ConversationType)._id}
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
              className={twMerge(
                'gap-2.5 flex cursor-pointer dark:bg-gray-700 items-center rounded w-fit max-w-[200px] bg-gray-300 p-3 overflow-hidden relative',
                !isOwner && 'text-black'
              )}>
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
        {message.messageType === 'NOTIFY' && (
          <p className="flex-center text-sm text-gray-400">{message.text}</p>
        )}
        {message.messageType === 'DEFAULT' && (
          <div
            ref={ref}
            className={twMerge(
              `chat ${styles.chatMessage} ${
                isOwner ? 'chat-end' : 'chat-start'
              }`
            )}>
            <div className="chat-image avatar">
              <Avatar
                size={'40px'}
                src={message.sender?.avatar || ''}
                round
                name={`${message.sender?.firstName} ${message.sender?.lastName}`}
              />
            </div>
            {isLastSame && (
              <div
                className={`chat-header mb-1 gap-2.5 flex items-center ${
                  isOwner ? 'flex-row-reverse' : ''
                }`}>
                <span
                  className={
                    'font-semibold'
                  }>{`${message.sender?.firstName} ${message.sender?.lastName}`}</span>
              </div>
            )}
            <div
              className={twMerge(
                `chat-bubble ${
                  isOwner
                    ? 'bg-via-500 dark:bg-via-300 text-light-1100 dark:text-night-1100'
                    : 'bg-primary text-light'
                } relative max-w-[50%]`,
                message.file && 'bg-transparent p-0',
                messageReplyActive?._id === message._id && 'ring-offset-1 ring',
                songMessage && 'bg-[#34224f] min-w-[25%]'
              )}>
              {message.reply && (
                <>
                  <div
                    onClick={() =>
                      scrollToMessageReply &&
                      scrollToMessageReply(message.reply!)
                    }
                    className={`${styles.messageReply} cursor-pointer m-1 ${
                      isOwner ? `${styles.isOwner}` : ''
                    }`}>
                    <p className={`font-semibold`}>
                      {message.reply?.sender?.firstName}{' '}
                      {message.reply?.sender?.lastName}
                    </p>
                    {message.reply?.text ? (
                      <div
                        className={`text-sm line-clamp-1`}
                        dangerouslySetInnerHTML={{
                          __html: message.reply?.text,
                        }}></div>
                    ) : (
                      <p className={`text-sm line-clamp-1`}>Sent a file</p>
                    )}
                  </div>
                </>
              )}
              {message.text && (
                <div
                  className={`tooltip un-reset ${
                    isOwner ? 'tooltip-left' : 'tooltip-right'
                  }`}
                  data-tip={moment(message.updatedAt)
                    .locale('en')
                    .format('LLL')}
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              )}
              {message.file && (
                <div
                  className={`tooltip un-reset ${
                    isOwner ? 'tooltip-left' : 'tooltip-right'
                  }`}
                  data-tip={moment(message.updatedAt)
                    .locale('en')
                    .format('LLL')}>
                  {renderFile}
                </div>
              )}
              {songMessage && <SongMessage song={songMessage} />}
              <div
                className={`absolute  ${styles.chatActions} ${
                  isOwner
                    ? 'left-[-45px] dropdown-left'
                    : 'right-[-45px] dropdown-right'
                } top-0 flex items-center gap-1`}>
                <div
                  className={`dropdown ${
                    isLastSame ? 'dropdown-bottom' : 'dropdown-top'
                  }`}>
                  <div className={'flex items-center gap-2.5'}>
                    <button tabIndex={0}>
                      <BsThreeDotsVertical
                        size={15}
                        className={'text-primary'}
                      />
                    </button>
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content menu p-2 shadow bg-light dark:bg-via-300 rounded-box w-52 z-10">
                    <li>
                      <a
                        onClick={() => {
                          dispatch(setReplyMessage(message));
                          eventBus.emit(EDITOR_FOCUS, true);
                        }}
                        className={
                          'flex items-center justify-between text-light-1100 dark:text-night-1100'
                        }>
                        <span>Reply</span>
                        <BsReplyFill size={20} />
                      </a>
                    </li>
                    {/* {isOwner && (
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
                  )} */}
                  </ul>
                </div>
                <Reactions message={message}/>
              </div>
            </div>
          </div>
        )}
        {openDelete && (
          <ConfirmDelete
            isOpen={openDelete}
            title={t.confirmDelete}
            message={t.descDeleteMessage}
            onClose={() => setOpenDelete(false)}
            onConfirm={handleDeleteMessage}
          />
        )}
      </>
    );
  }
);

interface ISongMessage {
  song: SongInfoType;
}

Message.displayName = 'Message';

export default Message;
