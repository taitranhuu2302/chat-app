import Reactions from '@/components/Chat/Reactions';
import SongMessage from '@/components/Chat/SongMessage';
import ConfirmDelete from '@/components/Dialog/ConfirmDelete';
import eventBus from '@/config/EventBus';
import { EDITOR_FOCUS } from '@/constants/Chat';
import useTranslate from '@/hooks/useTranslate';
import { setReplyMessage } from '@/redux/features/MessageSlice';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useDeleteMessageApi } from '@/service/MessageService';
import styles from '@/styles/components/chat.module.scss';
import { formatListReactions } from '@/utils/ArrayUtils';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { getFileType } from '@/utils/FileUtils';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Avatar from 'react-avatar';
import toast from 'react-hot-toast';
import {
  BsFillFileTextFill,
  BsReplyFill,
  BsThreeDotsVertical,
} from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';
import { reactionIcons } from '../../constants/Chat';
import VideoPlayer from './VideoPlayer';

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
    const [reactions, setReactions] = useState<ReactionType[]>([])

    useEffect(() => {
      dispatch(onPageLoading(deleteMessageLoading));
    }, [deleteMessageLoading]);

    useEffect(() => {
      setReactions(message.reactions)
    }, [message])

    const reactionsCount = useMemo(() => {
      return formatListReactions(reactions)
    }, [reactions])

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

    const onCallbackReactions = (data: ReactionType) => {
      const userIndex = reactions.findIndex(item => item.user._id === data.user._id);

      if (userIndex !== -1) {
        const updatedReactions = [...reactions];
        updatedReactions[userIndex] = data;
        setReactions(updatedReactions);
      } else {
        setReactions(prevReactions => [...prevReactions, data]);
      }
    };


    return (
      <>
        {message.messageType === 'NOTIFY' && (
          <p className="flex-center text-sm text-gray-400">{message.text}</p>
        )}
        {message.messageType === 'DEFAULT' && (
          <div
            ref={ref}
            className={twMerge(
              `chat relative ${styles.chatMessage} ${isOwner ? 'chat-end' : 'chat-start'
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
                className={`chat-header mb-1 gap-2.5 flex items-center ${isOwner ? 'flex-row-reverse' : ''
                  }`}>
                <span
                  className={
                    'font-semibold'
                  }>{`${message.sender?.firstName} ${message.sender?.lastName}`}</span>
              </div>
            )}
            <div
              className={twMerge(
                `chat-bubble ${isOwner
                  ? 'bg-via-500 dark:bg-via-300 text-light-1100 dark:text-night-1100'
                  : 'bg-primary text-light'
                } relative max-w-[50%]`,
                message.file && 'bg-transparent p-0',
                messageReplyActive?._id === message._id && 'ring-offset-1 ring',
                songMessage && 'bg-[#34224f] min-w-[25%]'
              )}>
              {!!reactionsCount && !!reactionsCount.length && (
                <div className={twMerge('absolute z-10 -bottom-2 flex items-center gap-1', isOwner ? 'left-4' : 'right-4 flex-row-reverse')}>
                  {reactionsCount.map((reaction, index) => {
                    return (
                      <div key={`${message._id}-react-${index}`} className={`${styles.reactionMore}`}>
                        <div className={twMerge('bg-white dark:bg-slate-500 relative shadow p-1 rounded-full flex items-center gap-1 text-black dark:text-white')}>
                          <picture>
                            <img src={reactionIcons.find(item => item.name === reaction.type)?.icon || ""} alt="" width={12} height={12} className='min-w-[12px] max-w-[12px]' />
                          </picture>
                          <span className='text-xs'>{reaction.count}</span>
                        </div>
                        <div className={`${styles.reactionDropdown} ${isOwner ? 'right-0' : 'left-0'}`}>
                          {reaction.users.map((item, index) => (
                            <p key={index}>{item.name}</p>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
              {message.reply && (
                <>
                  <div
                    onClick={() =>
                      scrollToMessageReply &&
                      scrollToMessageReply(message.reply!)
                    }
                    className={`${styles.messageReply} cursor-pointer m-1 ${isOwner ? `${styles.isOwner}` : ''
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
                  className={`tooltip un-reset ${isOwner ? 'tooltip-left' : 'tooltip-right'
                    }`}
                  data-tip={moment(message.updatedAt)
                    .locale('en')
                    .format('LLL')}
                  dangerouslySetInnerHTML={{ __html: message.text }}
                />
              )}
              {message.file && (
                <div
                  className={`tooltip un-reset ${isOwner ? 'tooltip-left' : 'tooltip-right'
                    }`}
                  data-tip={moment(message.updatedAt)
                    .locale('en')
                    .format('LLL')}>
                  {renderFile}
                </div>
              )}
              {songMessage && <SongMessage song={songMessage} />}
              <div
                className={`absolute ${styles.chatActions} ${isOwner
                  ? 'left-[-45px] dropdown-left'
                  : 'right-[-45px] dropdown-right'
                  } top-0 flex items-center gap-1`}>
                <div
                  className={`dropdown ${isLastSame ? 'dropdown-bottom' : 'dropdown-top'
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
                <Reactions
                  message={message}
                  onCallback={onCallbackReactions}
                  isOwner={isOwner}
                />
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
