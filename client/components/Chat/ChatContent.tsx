import React, {useEffect, useRef} from 'react';
import styles from '@/styles/components/chat.module.scss';
import Message from '@/components/Chat/Message';


interface IChatContent {
  messages: any[];
}

const ChatContent: React.FC<IChatContent> = ({ messages }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  
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
  
  return <div ref={contentRef} className={`${styles.chatContent} scrollbar`}>
    {
      messages.map((message, index) => {
        return <Message isFirst={index === 0} isOwner={true} message={message} key={index} />;
      })
    }
  </div>;
};

export default ChatContent;