import styles from '@/styles/components/chat.module.scss';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import ChatContent from '@/components/Chat/ChatContent';
import ChatFooter from '@/components/Chat/ChatFooter';
import ChatHeader from '@/components/Chat/ChatHeader';
import SidebarProfile from '@/components/Chat/SidebarProfile';
import { SOCKET_EVENT } from '@/constants/Socket';
import {
  setConversationStore,
  setUserOtherStore,
} from '@/redux/features/ConversationSlice';
import { setReplyMessage } from '@/redux/features/MessageSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useGetConversationById } from '@/service/ConversationService';
import {
  useGetMessageByConversationApi,
  useSendMessageApi,
} from '@/service/MessageService';
import { flatMapObjectInfinite } from '@/utils/ArrayUtils';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { AuthContext, AuthContextType } from 'contexts/AuthContext';
import FormData from 'form-data';
import { AnimatePresence, motion } from 'framer-motion';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { SocketContext, SocketContextType } from '../../contexts/SocketContext';
import Portal from '../Portal';

interface IChat {}

const Chat: React.FC<IChat> = () => {
  const [isOpenSidebar, setIsOpenSidebar] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isNewMessage, setIsNewMessage] = useState(false);
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
  const [userTyping, setUserTyping] = useState<IUserTyping[]>([]);
  const dispatch = useAppDispatch();
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { mutateAsync: sendMessage, isLoading: isLoadingSendMessage } =
    useSendMessageApi();
  const { socket } = useContext(SocketContext) as SocketContextType;
  const userOther = useMemo(() => {
    return conversation?.members.find((u) => u._id !== auth?._id);
  }, [auth, conversation]);

  const {
    hasNextPage,
    fetchNextPage,
    isLoading: getMessageLoading,
  } = useGetMessageByConversationApi({
    conversationId: id,
    options: {
      onSuccess: (data: any) => {
        const payload = flatMapObjectInfinite(data);
        setMessages([...payload]);
      },
    },
  });

  useEffect(() => {
    userOther && dispatch(setUserOtherStore(userOther));
    conversation && dispatch(setConversationStore(conversation));
  }, [userOther, conversation]);

  useEffect(() => {
    if (!socket) return;

    socket.on(
      SOCKET_EVENT.USER_IS_TYPING,
      ({ user, conversationId, isTyping }) => {
        if (user._id === auth?._id || conversationId !== id) return;
        setUserTyping((prevTypingUsers) => {
          const userIndex = prevTypingUsers.findIndex(
            (item) => item.user._id === user._id
          );

          if (isTyping && userIndex === -1) {
            return [...prevTypingUsers, { user, conversationId, isTyping }];
          }

          if (!isTyping && userIndex !== -1) {
            const updatedTypingUsers = [...prevTypingUsers];
            updatedTypingUsers.splice(userIndex, 1);
            return updatedTypingUsers;
          }

          return prevTypingUsers;
        });
      }
    );

    socket.on(SOCKET_EVENT.MESSAGE.NEW_MESSAGE, (data: MessageType[]) => {
      const conversationId =
        typeof data[0].conversation === 'string'
          ? data[0].conversation
          : data[0].conversation._id;
      if (conversationId === id) {
        setMessages((e) => [...data, ...e]);
        setIsNewMessage(true);
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
      socket.off(SOCKET_EVENT.USER_IS_TYPING);
    };
  }, [socket, id, auth?._id]);

  useEffect(() => {
    dispatch(setReplyMessage(null));
  }, [id]);

  const onToggleSidebar = () => {
    setIsOpenSidebar((e) => !e);
  };

  const onUserTyping = debounce((text) => {
    if (!auth || !socket || !conversation) return;

    socket.emit(SOCKET_EVENT.USER_TYPING, {
      user: auth,
      conversationId: conversation._id,
      text,
    });
  }, 500);

  const onTextChange = useCallback(
    (text: string) => {
      onUserTyping(text);
    },
    [onUserTyping]
  );

  const handleSendMessage = async ({
    text,
    conversation,
    reply,
    files,
    gifs,
    songs,
  }: MessageCreateType) => {
    if (!text && !files?.length && !gifs?.length && !songs?.length) return;

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
      if (songs && songs.length) {
        songs.forEach((song) => {
          formData.append('songs', JSON.stringify(song));
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
          userTyping={userTyping}
        />
        <ChatFooter
          handleSendMessage={handleSendMessage}
          isLoadingSendMessage={isLoadingSendMessage}
          onTextChange={onTextChange}
        />
      </motion.div>
      <AnimatePresence>
        {isOpenSidebar && conversation && (
          <Portal>
            <SidebarProfile
              onClose={onToggleSidebar}
              conversation={conversation}
            />
          </Portal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chat;
