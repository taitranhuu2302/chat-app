import Message from '@/components/Chat/Message';
import Fancybox from "@/components/Fancybox";
import styles from '@/styles/components/chat.module.scss';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import MessageSkeleton from '../Skeleton/MessageSkeleton';
import Avatar from 'react-avatar';
import MusicChat from './MusicChat';

interface IChatContent {
  messages: MessageType[];
  fetchNextPage: () => Promise<any>;
  hasNextPage?: boolean;
  isNewMessage?: boolean;
  setIsNewMessage?: (value: boolean) => void;
  getMessageLoading?: boolean;
  userTyping: IUserTyping[]
}

type MessageGroup = MessageType & {
  isSame: boolean;
  isLastSame?: boolean;
};

const ChatContent: React.FC<IChatContent> = ({
  messages,
  fetchNextPage,
  hasNextPage,
  isNewMessage,
  setIsNewMessage,
  getMessageLoading,
  userTyping
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [messageReplyActive, setMessageReplyActive] = useState<MessageType | null>(null)
  const { auth } = useContext(AuthContext) as AuthContextType;
  const listMessageRef = useRef<any[]>([]);
  const { ref: loadingRef, inView } = useInView();
  const messageGroup: MessageGroup[] = useMemo(() => {
    let result: MessageGroup[] = [];
    const messageReverse = messages.slice(0).reverse()
    for (let i = 0; i < messageReverse.length; i++) {
      const message = messageReverse[i];
      const lastMessage = i > 0 ? messageReverse[i - 1] : null;

      if (message.messageType === 'NOTIFY') {
        result.push({
          ...message,
          isSame: false
        })
        continue;
      }

      if (!lastMessage || message.sender?._id !== lastMessage.sender?._id) {
        // Phần tử đầu tiên của một nhóm mới
        if (i > 0) {
          result[i - 1].isLastSame = true;
        }
        result.push({ ...message, isSame: false, isLastSame: false });
      } else {
        // Phần tử liền kề
        result.push({ ...message, isSame: true, isLastSame: false });
        if (i === messageReverse.length - 1) {
          result[i].isLastSame = true;
        }
      }
    }
    return result;
  }, [messages]);

  useEffect(() => {
    if (contentRef && contentRef.current && isNewMessage) {
      const { scrollHeight, clientHeight } = contentRef.current;
      contentRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
      setIsNewMessage && setIsNewMessage(false)
    }
  }, [isNewMessage]);

  useEffect(() => {
    if (inView) {
      fetchNextPage().then((r) => { });
    }
  }, [inView, loadingRef]);

  const scrollToMessageReply = (message: MessageType) => {
    const item = listMessageRef.current.find(item => item.data._id === message._id)
    if (!item && contentRef && contentRef.current) {
      const { scrollHeight } = contentRef.current;
      contentRef.current.scrollTo({
        top: -scrollHeight,
        behavior: 'smooth',
      });
    }
    if (item) {
      item.element.scrollIntoView({
        behavior: 'smooth',
      })
      setMessageReplyActive(item.data)

      setTimeout(() => {
        setMessageReplyActive(null)
      }, 3000)
    } else {
      setTimeout(() => {
        scrollToMessageReply(message)
      }, 200)
    }
  }

  return (
    <Fancybox>
      {/*<MusicChat />*/}
      <div ref={contentRef} className={`${styles.chatContent} scrollbar`}>
        {
          userTyping.map((u, index) => {
            return (
              <div key={index} className="chat chat-start">
                <div className="chat-image avatar">
                  <Avatar size={'40px'} name={`${u.user.firstName} ${u.user.lastName}`} src={u.user.avatar || ""} round />
                </div>
                <div
                  className={`chat-header mb-1 gap-2.5 flex items-center`}>
                  <span
                    className={
                      'font-semibold'
                    }>{`${u.user?.firstName} ${u.user?.lastName}`}</span>
                </div>
                <div className="chat-bubble bg-primary text-light">
                  <span className="loading loading-dots loading-md"></span>
                </div>
              </div>
            )
          })
        }
        {
          getMessageLoading && Array(10).fill(0).map((_, index) => (
            <MessageSkeleton key={index} isOwner={Math.floor(Math.random() * 10) % 2 === 0} />
          ))
        }
        {messageGroup.map((message, index) => {
          return (
            <Message
              ref={(c) => listMessageRef.current[index] = {
                element: c,
                data: message
              }}
              isFirst={index === messageGroup.length - 1}
              isLastSame={message.isLastSame}
              isOwner={auth?._id === message.sender?._id}
              message={message}
              key={message._id}
              isSameOwner={message.isSame}
              scrollToMessageReply={scrollToMessageReply}
              messageReplyActive={messageReplyActive}
            />
          );
        })}
        {hasNextPage && (
          <div ref={loadingRef} className={'flex-center'}>
            Loading...
          </div>
        )}
      </div>
    </Fancybox>
  );
};

export default ChatContent;
