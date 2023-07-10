import React, { useContext, useEffect, useRef, useState } from 'react';
import TabContainer from '@/components/Tabs/TabContainer';
import Input from '@/components/Input';
import { IoSearchOutline } from 'react-icons/io5';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import useTranslate from '@/hooks/useTranslate';
import ModalCreateGroup from '@/components/Modals/ModalCreateGroup';
import { useGetConversationByUser } from '@/service/ConversationService';
import { flatMapObjectInfinite } from '@/utils/ArrayUtils';
import moment from 'moment';
import Skeleton from 'react-loading-skeleton';
import { SocketContext, SocketContextType } from '../../contexts/SocketContext';
import { SOCKET_EVENT } from '@/constants/Socket';
import { useInView } from 'react-intersection-observer';

interface ITabChat { }

const TabChat: React.FC<ITabChat> = () => {
  const t = useTranslate();
  const { ref: loadingRef, inView } = useInView()
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const { socket } = useContext(SocketContext) as SocketContextType;
  const { isLoading: isLoadingConversations, hasNextPage, fetchNextPage } = useGetConversationByUser({
    options: {
      onSuccess: (data: any) => {
        setConversations(flatMapObjectInfinite(data));
      },
    },
  });

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EVENT.CONVERSATION.CREATE_CONVERSATION, (data: ConversationType) => {
      setConversations((c) => [data, ...c]);
    });
    return () => {
      socket.off(SOCKET_EVENT.CONVERSATION.CREATE_CONVERSATION);
    };
  }, [socket]);

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView, loadingRef])

  return (
    <>
      <TabContainer
        title={t.home.tab.chat.title}
        headerActions={
          <>
            <ModalCreateGroup />
          </>
        }>
        <Input
          className={'mt-5'}
          placeholder={t.home.tab.chat.searchHint}
          iconStart={<IoSearchOutline size={20} />}
        />
        <div className={'py-5 flex flex-col flex-grow'}>
          <p className={'py-2.5 text-lg flex-shrink font-semibold'}>
            {t.home.tab.chat.recent}
          </p>
          <div
            className={'flex flex-col h-0 flex-grow overflow-y-auto scrollbar'}>
            {isLoadingConversations
              ? Array(5)
                .fill(1)
                .map((_, index) => (
                  <div
                    key={index}
                    className={'flex items-center gap-2.5 p-4'}>
                    <Skeleton circle={true} width={45} height={45} />
                    <div className={'flex flex-col gap-2.5'}>
                      <Skeleton width={200} height={20} />
                      <Skeleton width={200} height={15} />
                    </div>
                  </div>
                ))
              : conversations.map((c) => (
                <TabChatItem key={c._id} conversation={c} />
              ))}
            {
              hasNextPage && (
                <div ref={loadingRef} className='flex-center'>
                  Loading...
                </div>
              )
            }
          </div>
        </div>
      </TabContainer>
    </>
  );
};

type TabChatItemType = {
  conversation: ConversationType;
};

const TabChatItem = ({ conversation }: TabChatItemType) => {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        await router.push({
          pathname: `/rooms/[id]`,
          query: {
            ...router.query,
            id: conversation._id,
          },
        });
      }}
      className={
        'flex items-center gap-2.5 cursor-pointer dark:hover:bg-via-300 hover:bg-via-500 p-4 transition-all duration-500'
      }>
      <Avatar
        round
        src={conversation.avatar}
        name={conversation.conversationName}
        size={'40px'}
      />
      <div className={'flex flex-col flex-grow truncate'}>
        <p className={'text-md font-semibold'}>
          {conversation.conversationName}
        </p>
        {conversation.latestMessage ? (
          conversation.latestMessage.text ? (
            <div
              className={
                'text-md font-light text-light-600 dark:text-night-600 un-reset'
              }
              dangerouslySetInnerHTML={{
                __html: conversation.latestMessage.text,
              }}></div>
          ) : (
            <p
              className={
                'text-sm font-light text-light-600 dark:text-night-600'
              }>
              Sent a file
            </p>
          )
        ) : (
          <p
            className={'text-sm font-light text-light-600 dark:text-night-600'}>
            There are no messages yet
          </p>
        )}
      </div>
      <div className={'flex flex-col items-center gap-1'}>
        <p className={'text-sm text-light-600 dark:text-night-600 truncate'}>
          {moment(conversation.updatedAt).locale(router.locale === 'vi' ? 'vi' : 'en').fromNow()}
        </p>
        {/* <div className="badge badge-sm">5</div> */}
      </div>
    </div>
  );
};

export default TabChat;
