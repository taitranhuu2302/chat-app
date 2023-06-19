import React, { useContext, useEffect, useState } from 'react';
import TabContainer from '@/components/Tabs/TabContainer';
import Input from '@/components/Input';
import { IoSearchOutline } from 'react-icons/io5';
import Avatar from 'react-avatar';
import useTranslate from '@/hooks/useTranslate';
import {
  useAcceptRequestFriendApi,
  useGetFriendRequestByUser,
  useRejectRequestFriendApi,
} from '@/service/UserService';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import IconLoading from '@/components/Loading/IconLoading';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ConfirmDelete from '@/components/Dialog/ConfirmDelete';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import { getErrorResponse } from '@/utils/ErrorUtils';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';
import { flatMapObjectInfinite } from '@/utils/ArrayUtils';
import Skeleton from 'react-loading-skeleton';
import { SocketContext, SocketContextType } from '../../contexts/SocketContext';
import { SOCKET_EVENT } from '@/constants/Socket';
import {useEffectOnce} from "usehooks-ts";
import { setCountRequestFriend } from '@/redux/features/NotifySlice';

interface Props {}

const TabFriendPending: React.FC<Props> = () => {
  const t = useTranslate();
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { socket } = useContext(SocketContext) as SocketContextType;
  const [friends, setFriends] = useState<UserType[]>([]);
  const { isLoading } = useGetFriendRequestByUser({
    id: auth?._id,
    options: {
      onSuccess: (data: any) => {
        setFriends(flatMapObjectInfinite(data).map((item) => item.sender));
      },
    },
  });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setCountRequestFriend(0))
    if (!socket) return;
    socket.on(SOCKET_EVENT.USER.SEND_REQUEST_FRIEND, (data: UserType) => {
      setFriends([data, ...friends]);
    });

    socket.on(SOCKET_EVENT.USER.CANCEL_FRIEND_REQUEST, (data: UserType) => {
      setFriends((fs) => fs.filter((f) => f._id !== data._id));
    });

    return () => {
      socket.off(SOCKET_EVENT.USER.SEND_REQUEST_FRIEND);
      socket.off(SOCKET_EVENT.USER.CANCEL_FRIEND_REQUEST);
    };
  }, [socket]);

  return (
    <>
      <TabContainer title={t.home.tab.group.title}>
        <Input
          className={'mt-5'}
          placeholder={t.home.tab.group.searchHint}
          iconStart={<IoSearchOutline size={20} />}
        />
        <div className={'py-5 flex flex-col flex-grow'}>
          <div
            className={'flex flex-col h-0 flex-grow overflow-y-auto scrollbar'}>
            {isLoading &&
              Array(5)
                .fill(1)
                .map((_, index) => (
                  <div key={index} className={'flex items-center gap-2.5'}>
                    <Skeleton circle={true} width={50} height={50} />
                    <div className={'flex-grow'}>
                      <Skeleton />
                      <Skeleton width={'50%'} />
                    </div>
                  </div>
                ))}
            {friends.map((friend, index) => {
              return (
                <TabFriendPendingItem
                  isLastItem={
                    friends.length > 2 && friends.length - 1 === index
                  }
                  key={friend._id}
                  friend={friend}
                />
              );
            })}
          </div>
        </div>
      </TabContainer>
    </>
  );
};

type PendingItemType = {
  friend: UserType;
  isLastItem?: boolean;
};

const TabFriendPendingItem = ({ friend, isLastItem }: PendingItemType) => {
  const fullName = `${friend.firstName} ${friend.lastName}`;
  let idRandom = Math.random();
  const t = useTranslate();
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { mutateAsync: rejectRequestFriend, isLoading: rejectRequestLoading } =
    useRejectRequestFriendApi();
  const { mutateAsync: acceptRequestFriend, isLoading: acceptRequestLoading } =
    useAcceptRequestFriendApi();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  useEffectOnce(() => {
    (async () => {
      await queryClient.refetchQueries([API.USER.COUNT_REQUEST_FRIEND])
    })()
  })

  useEffect(() => {
    dispatch(onPageLoading(rejectRequestLoading || acceptRequestLoading));
  }, [rejectRequestLoading, acceptRequestLoading]);

  const handleDelete = async () => {
    try {
      await rejectRequestFriend({
        senderId: friend._id,
        receiverId: auth?._id!,
      });
      await queryClient.refetchQueries([
        API.USER.GET_REQUEST_FRIEND,
        auth?._id!,
      ]);
      await queryClient.refetchQueries([API.USER.GET_FRIEND, auth?._id])
      setIsOpen(false);
    } catch (e: any) {
      const errors = getErrorResponse(e.message);
      toast.error(errors[0]);
    }
  };

  const handleAccept = async () => {
    try {
      await acceptRequestFriend({
        senderId: friend._id,
        receiverId: auth?._id!,
      });
      await queryClient.refetchQueries([
        API.USER.GET_REQUEST_FRIEND,
        auth?._id!,
      ]);
      await queryClient.refetchQueries([API.USER.GET_FRIEND, auth?._id])
      setIsOpen(false);
      toast.success(t.messageAcceptRequestSuccess);
    } catch (e: any) {
      const errors = getErrorResponse(e.message);
      toast.error(errors[0]);
    }
  };

  return (
    <div
      className={
        'flex items-center gap-2.5 dark:hover:bg-via-300 hover:bg-via-500 cursor-pointer p-3 rounded'
      }>
      <Avatar name={fullName} size={'40px'} src={friend.avatar} round />
      <div className={'flex-grow'}>
        <p className={'text-md font-semibold'}>{fullName}</p>
      </div>
      <div className={'flex items-center gap-2.5'}>
        <div
          className={`dropdown dropdown-left ${
            isLastItem ? 'dropdown-top' : ''
          }`}>
          <label tabIndex={idRandom} className="cursor-pointer">
            <BsThreeDotsVertical size={20} />
          </label>
          <ul
            tabIndex={idRandom}
            className="dropdown-content menu p-2 shadow bg-via-400 dark:bg-via-300 rounded-box w-52">
            <li onClick={handleAccept}>
              <a>{t.accept}</a>
            </li>
            <li onClick={() => setIsOpen(true)}>
              <a>{t.reject}</a>
            </li>
          </ul>
        </div>
      </div>
      <ConfirmDelete
        isOpen={isOpen}
        onConfirm={handleDelete}
        title={t.requestFriend}
        message={t.messageRejectRequestFriend}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default TabFriendPending;
