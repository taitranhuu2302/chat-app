import React, { useState } from 'react';
import styles from '@/styles/components/chat.module.scss';

import ChatHeader from '@/components/Chat/ChatHeader';
import ChatContent from '@/components/Chat/ChatContent';
import ChatFooter from '@/components/Chat/ChatFooter';
import SidebarProfile from '@/components/Chat/SidebarProfile';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useGetConversationById } from '@/service/ConversationService';

interface IChat {}

const Chat: React.FC<IChat> = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [conversation, setConversation] = useState<ConversationType | null>(
    null
  );
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const {isLoading: isLoadingConversation} = useGetConversationById({
    conversationId: id,
    options: {
      onSuccess: ({ data }: ResponseSuccess<ConversationType>) => {
        setConversation(data);
      },
    },
  });

  const onToggleSidebar = () => {
    setIsOpenSidebar((e) => !e);
  };

  const handleSendMessage = (message: string) => {
    setMessages((e) => [...e, message]);
  };

  return (
    <div
      className={
        'dark:bg-via-100 flex w-full h-full overflow-x-hidden lg:relative absolute bg-white z-[100]'
      }>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.5, type: 'linear' }}
        className={`${styles.wrapperChat}`}>
        <ChatHeader conversation={conversation} isLoadingConversation={isLoadingConversation} onToggleSidebar={onToggleSidebar} />
        <ChatContent messages={messages} />
        <ChatFooter handleSendMessage={handleSendMessage} />
      </motion.div>
      <AnimatePresence>
        {isOpenSidebar && <SidebarProfile onClose={onToggleSidebar} />}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
