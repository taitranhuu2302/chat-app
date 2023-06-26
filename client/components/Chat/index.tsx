import React, { useContext, useEffect, useState } from 'react';
import styles from '@/styles/components/chat.module.scss';

import ChatHeader from '@/components/Chat/ChatHeader';
import ChatContent from '@/components/Chat/ChatContent';
import ChatFooter from '@/components/Chat/ChatFooter';
import SidebarProfile from '@/components/Chat/SidebarProfile';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useGetConversationById } from '@/service/ConversationService';
import {
  useGetMessageByConversationApi,
  useSendMessageApi,
} from '@/service/MessageService';
import FormData from 'form-data';
import { flatMapObjectInfinite } from '@/utils/ArrayUtils';
import { SocketContext, SocketContextType } from '../../contexts/SocketContext';
import { SOCKET_EVENT } from '@/constants/Socket';

interface IChat {}

const Chat: React.FC<IChat> = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [conversation, setConversation] = useState<ConversationType | null>(
    null
  );
  const router = useRouter();
  const {
    query: { id },
  } = router;
  const { isLoading: isLoadingConversation } = useGetConversationById({
    conversationId: id,
    options: {
      onSuccess: ({ data }: ResponseSuccess<ConversationType>) => {
        setConversation(data);
      },
    },
  });
  const { mutateAsync: sendMessage, isLoading: isLoadingSendMessage } =
    useSendMessageApi();
  const { socket } = useContext(SocketContext) as SocketContextType;

  const { hasNextPage, fetchNextPage } = useGetMessageByConversationApi({
    conversationId: id,
    options: {
      onSuccess: (data: any) => {
        const payload = flatMapObjectInfinite(data);
        setMessages([...payload]);
      },
    },
  });

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, (data: MessageType) => {
      if (data.conversation._id === id) {
        setMessages((e) => [data, ...e]);
      }
    });

    return () => {
      socket.off(SOCKET_EVENT.MESSAGE.NEW_MESSAGE);
    };
  }, [socket, id]);

  const onToggleSidebar = () => {
    setIsOpenSidebar((e) => !e);
  };

  const handleSendMessage = async ({
    text,
    conversation,
    reply,
    files,
  }: MessageCreateType) => {
    if (!text && !files) return;
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('conversation', conversation);
      formData.append('reply', reply);
      if (files && files.length) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }
      await sendMessage(formData).then(({ data }: { data: MessageType }) => {
        // setMessages((e) => [data, ...e]);
      });
    } catch (e: any) {
      console.error(e.message);
    }
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
        <ChatHeader
          conversation={conversation}
          isLoadingConversation={isLoadingConversation}
          onToggleSidebar={onToggleSidebar}
        />
        <ChatContent
          messages={messages.slice(0).reverse()}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
        <ChatFooter
          handleSendMessage={handleSendMessage}
          isLoadingSendMessage={isLoadingSendMessage}
        />
      </motion.div>
      <AnimatePresence>
        {isOpenSidebar && <SidebarProfile onClose={onToggleSidebar} />}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
