import React, { useContext, useEffect, useState } from 'react';
import TabContainer from '@/components/Tabs/TabContainer';
import Input from '@/components/Input';
import { IoSearchOutline } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';
import _, { flatMap } from 'lodash';
import { useEffectOnce } from 'usehooks-ts';
import { flatMapObjectInfinite, groupByFirstLetter } from '@/utils/ArrayUtils';
import useTranslate from '@/hooks/useTranslate';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { useCancelFriendApi, useGetFriendByUser } from '@/service/UserService';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import Skeleton from 'react-loading-skeleton';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import ConfirmDelete from '@/components/Dialog/ConfirmDelete';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';
import { SocketContext, SocketContextType } from '../../contexts/SocketContext';
import { SOCKET_EVENT } from '@/constants/Socket';

interface ITabContact {}

const TabContact: React.FC<ITabContact> = () => {
  const t = useTranslate();
  const [contacts, setContacts] = useState<any>([]);
  const { auth } = useContext(AuthContext) as AuthContextType;
  const { socket } = useContext(SocketContext) as SocketContextType;
  const { isLoading } = useGetFriendByUser({
    id: auth?._id,
    options: {
      onSuccess: (data: any) => {
        const arr = flatMapObjectInfinite(data).map((item: any) => item.friend);
        setContacts([
          ...groupContacts(arr),
        ]);
      },
    },
  });

  const groupContacts = (data: any[]) => {
    return groupByFirstLetter(
        _.sortBy(data, (value) => value.firstName),
        (item) => item.firstName[0]
    );
  }

  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_EVENT.USER.ACCEPT_FRIEND_REQUEST, (data: UserType) => {
      setContacts((c: any) => [
        ...c,
        ...groupContacts([data]),
      ]);
    });
    socket.on(SOCKET_EVENT.USER.UN_FRIEND, (data: UserType) => {
      const arr = contacts.flatMap((c: any) => c.list).filter((item: UserType) => item._id !== data._id);
      setContacts([...groupContacts(arr)])
    });
    return () => {
      socket.off(SOCKET_EVENT.USER.ACCEPT_FRIEND_REQUEST);
      socket.off(SOCKET_EVENT.USER.UN_FRIEND);
    };
  }, [socket]);

  return (
    <>
      <TabContainer
        title={t.home.tab.contact.title}
        headerActions={
          <label htmlFor="modal-search-user" className="block cursor-pointer">
            <AiOutlineUserAdd size={22} />
          </label>
        }>
        <Input
          className={'mt-5'}
          placeholder={t.home.tab.contact.searchHint}
          iconStart={<IoSearchOutline size={20} />}
        />
        <div
          className={
            'flex px-2.5 gap-2.5 flex-col h-0 flex-grow overflow-y-auto scrollbar mt-5'
          }>
          {isLoading &&
            Array(5)
              .fill(0)
              .map((_, index) => (
                <div key={index}>
                  <Skeleton width={50} />
                  <Skeleton />
                </div>
              ))}
          {contacts.map((item: any, index: number) => {
            return (
              <div key={index} className={'py-2.5'}>
                <p className={'text-primary font-semibold'}>{item.name}</p>
                {item.list.map((subItem: UserType, subIndex: number) => {
                  return (
                    <TabContactItem
                      isLastItem={
                        item.list.length > 1 &&
                        item.list.length - 1 === subIndex
                      }
                      user={subItem}
                      key={`contact-${subItem._id}-${subIndex}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </TabContainer>
    </>
  );
};

type TabContactItemType = {
  user: UserType;
  isLastItem?: boolean;
};

const TabContactItem = ({ user, isLastItem }: TabContactItemType) => {
  const t = useTranslate();
  let idRandom = Math.random();
  const { mutateAsync: cancelFriend, isLoading: cancelFriendLoading } =
    useCancelFriendApi();
  const dispatch = useAppDispatch();
  const [openDelete, setOpenDelete] = useState(false);
  const queryClient = useQueryClient();
  const { auth } = useContext(AuthContext) as AuthContextType;

  useEffect(() => {
    dispatch(onPageLoading(cancelFriendLoading));
  }, [cancelFriendLoading]);

  const handleCancelFriend = async () => {
    try {
      await cancelFriend({
        friendId: user._id,
      });
      await queryClient.refetchQueries([API.USER.GET_FRIEND, auth?._id!]);
      setOpenDelete(false);
    } catch (e: any) {
      const error = getErrorResponse(e.message);
      toast.error(error[0]);
    }
  };

  return (
    <div className={'cursor-pointer py-4 flex items-center'}>
      <p className={'flex-grow'}>
        {user.firstName} {user.lastName}
      </p>
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
          <li>
            <a>Chat</a>
          </li>
          <li onClick={() => toast.error('Chức năng đang phát triển')}>
            <a>{t.home.tab.contact.itemActions.block}</a>
          </li>
          <li onClick={() => setOpenDelete(true)}>
            <a>{t.home.tab.contact.itemActions.remove}</a>
          </li>
        </ul>
      </div>
      <ConfirmDelete
        isOpen={openDelete}
        title={t.friend}
        message={t.messageCancelFriend}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleCancelFriend}
      />
    </div>
  );
};

export default TabContact;
