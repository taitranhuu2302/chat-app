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
import { getErrorResponse } from '@/utils/ErrorUtils';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { setReplyMessage } from '@/redux/features/MessageSlice';
import Portal from '../Portal';

interface IChat { }

const Chat: React.FC<IChat> = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isNewMessage, setIsNewMessage] = useState(false)
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
  const dispatch = useAppDispatch();
  const { mutateAsync: sendMessage, isLoading: isLoadingSendMessage } =
    useSendMessageApi();
  const { socket } = useContext(SocketContext) as SocketContextType;

  const { hasNextPage, fetchNextPage, isLoading: getMessageLoading } = useGetMessageByConversationApi({
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

    socket.on(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, (data: MessageType[]) => {
      const conversationId = typeof data[0].conversation === 'string' ? data[0].conversation : data[0].conversation._id
      if (conversationId === id) {
        setMessages((e) => [...data, ...e]);
        setIsNewMessage(true)
      }
    });

    socket.on(SOCKET_EVENT.MESSAGE.MESSAGE_RECALL, (data: MessageType) => {
      if ((data.conversation as ConversationType)._id === id) {
        setMessages((m) => m.filter((message) => message._id !== data._id));
      }
    });

    return () => {
      socket.off(SOCKET_EVENT.MESSAGE.NEW_MESSAGE);
      socket.off(SOCKET_EVENT.MESSAGE.MESSAGE_RECALL);
    };
  }, [socket, id]);

  useEffect(() => {
    dispatch(setReplyMessage(null));
  }, [id]);

  const onToggleSidebar = () => {
    setIsOpenSidebar((e) => !e);
  };

  const handleSendMessage = async ({
    text,
    conversation,
    reply,
    files,
    gifs,
  }: MessageCreateType) => {
    if (!text && !files?.length && !gifs?.length) return;

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('conversation', conversation);
      if (reply) {
        formData.append('reply', reply);
      }
      if (files && files.length) {
        files.forEach((file) => {
          formData.append('files', file);
        });
      }
      if (gifs && gifs.length) {
        gifs.forEach((gif) => {
          formData.append('gifs', gif);
        });
      }
      await sendMessage(formData);
    } catch (e: any) {
      const errors = getErrorResponse(e.message);
      toast.error(errors[0]);
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
          isNewMessage={isNewMessage}
          setIsNewMessage={setIsNewMessage}
          messages={messages.slice(0).reverse()}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          getMessageLoading={getMessageLoading}
        />
        <ChatFooter
          handleSendMessage={handleSendMessage}
          isLoadingSendMessage={isLoadingSendMessage}
        />
      </motion.div>
      <AnimatePresence>
        {isOpenSidebar && conversation && <Portal><SidebarProfile onClose={onToggleSidebar} conversation={conversation} /></Portal>}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
