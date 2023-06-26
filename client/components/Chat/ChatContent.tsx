import React, { useContext, useEffect, useMemo, useRef } from 'react';
import styles from '@/styles/components/chat.module.scss';
import Message from '@/components/Chat/Message';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import { useInView } from 'react-intersection-observer';

interface IChatContent {
  messages: MessageType[];
  fetchNextPage: () => Promise<any>;
  hasNextPage?: boolean;
}

type MessageGroup = MessageType & {
  isSame: boolean;
  isLastSame?: boolean;
};

const ChatContent: React.FC<IChatContent> = ({
  messages,
  fetchNextPage,
  hasNextPage,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { ref: loadingRef, inView } = useInView();
  const messageGroup: MessageGroup[] = useMemo(() => {
    let result: MessageGroup[] = [];

    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];
      const lastMessage = i > 0 ? messages[i - 1] : null;

      if (!lastMessage || message.sender._id !== lastMessage.sender._id) {
        // Phần tử đầu tiên của một nhóm mới
        if (i > 0) {
          result[i - 1].isLastSame = true;
        }
        result.push({ ...message, isSame: false, isLastSame: false });
      } else {
        // Phần tử liền kề
        result.push({ ...message, isSame: true, isLastSame: false });
        if (i === messages.length - 1) {
          result[i].isLastSame = true;
        }
      }
    }
    return result;
  }, [messages]);

  useEffect(() => {
    if (contentRef && contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      contentRef.current.scrollTo({
        left: 0,
        top: scrollHeight - clientHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    if (inView) {
      fetchNextPage().then((r) => {});
    }
  }, [inView]);

  return (
    <div ref={contentRef} className={`${styles.chatContent} scrollbar`}>
      {hasNextPage && (
        <div ref={loadingRef} className={'flex-center'}>
          Loading...
        </div>
      )}
      {messageGroup.map((message, index) => {
        return (
          <Message
            isFirst={index === 0}
            isLastSame={message.isLastSame}
            isOwner={auth?._id === message.sender._id}
            message={message}
            key={message._id}
            isSameOwner={message.isSame}
          />
        );
      })}
    </div>
  );
};

export default ChatContent;
