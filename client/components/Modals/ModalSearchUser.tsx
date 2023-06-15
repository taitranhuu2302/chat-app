import useTranslate from '@/hooks/useTranslate';
import {
  useCancelRequestFriendApi,
  useGetUserApi,
  useSendRequestFriendApi,
} from '@/service/UserService';
import { AuthContext, AuthContextType } from 'contexts/AuthContext';
import React, { useCallback, useContext, useState } from 'react';
import Avatar from 'react-avatar';
import { IoSearchOutline } from 'react-icons/io5';
import { useDebounce } from 'usehooks-ts';
import Input from '../Input';
import IconLoading from '../Loading/IconLoading';

interface Props {}

const ModalSearchUser: React.FC<Props> = () => {
  const t = useTranslate();
  const [keywords, setKeywords] = useState<string>('');
  const debounceSearchQuery = useDebounce(keywords, 500);
  const [users, setUsers] = useState<UserType[]>([]);
  const { auth } = useContext(AuthContext) as AuthContextType;
  const {
    mutateAsync: sendFriendRequest,
    isLoading: sendFriendRequestLoading,
  } = useSendRequestFriendApi({
    onSuccess: () => {
      refetch();
    },
  });
  const {
    mutateAsync: cancelFriendRequest,
    isLoading: cancelFriendRequestLoading,
  } = useCancelRequestFriendApi({
    onSuccess: () => {
      refetch();
    },
  });

  const { isLoading, refetch } = useGetUserApi({
    options: {
      enabled: !!debounceSearchQuery,
      onSuccess: ({ data }: { data: Paginate<UserType> }) => {
        setUsers(data.results.filter((u) => u._id !== auth?._id));
      },
    },
    query: {
      keywords: debounceSearchQuery,
    },
  });

  const handleChangeSearch = (value: string) => {
    if (!value) {
      setUsers([]);
    }

    setKeywords(value);
  };

  const renderButtonAction = useCallback(
    (currentUser: CurrentUser, userId: string) => {
      if (currentUser.isFriend) {
        return (
          <button className="btn btn-sm btn-outline btn-error">
            Cancel Friend
          </button>
        );
      }

      if (currentUser.isRequestSent) {
        return (
          <button
            disabled={cancelFriendRequestLoading}
            onClick={() =>
              cancelFriendRequest({
                senderId: auth?._id!,
                receiverId: userId,
              })
            }
            className="btn btn-sm btn-outline btn-error">
            {sendFriendRequestLoading ? (
              <IconLoading color="#DC3545" size="20px" />
            ) : (
              'Cancel Request Friend'
            )}
          </button>
        );
      }

      if (currentUser.isRequestReceived) {
        return (
          <button className="btn btn-sm btn-outline btn-success">
            Accept Request Friend
          </button>
        );
      }

      return (
        <button
          disabled={sendFriendRequestLoading}
          onClick={() =>
            sendFriendRequest({
              senderId: auth?._id!,
              receiverId: userId,
            })
          }
          className="btn btn-sm btn-outline btn-info">
          {sendFriendRequestLoading ? (
            <IconLoading color="#007BFF" size="20px" />
          ) : (
            'Add Friend'
          )}
        </button>
      );
    },
    [sendFriendRequestLoading, auth?._id, cancelFriendRequestLoading]
  );

  return (
    <>
      <input type="checkbox" id="modal-search-user" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box max-w-[900px]">
          <Input
            placeholder={t.home.tab.contact.searchHint}
            value={keywords}
            onChange={handleChangeSearch}
            iconStart={<IoSearchOutline size={20} />}
          />
          <ul className="flex flex-col gap-3 mt-5">
            {!isLoading && !users.length && (
              <li className="flex-center font-semibold text-lg">
                {`Let's look for someone`}
              </li>
            )}
            {isLoading && (
              <li className="flex-center">
                <IconLoading color="#333" size={'35px'} />
              </li>
            )}
            {users.map((user: UserType) => {
              const fullName = `${user.firstName} ${user.lastName}`;
              return (
                <li
                  key={`search-${user._id}`}
                  className="flex items-center justify-between">
                  <div className="flex gap-2.5 items-center">
                    <Avatar
                      size={'40px'}
                      round
                      src={user.avatar}
                      name={fullName}
                    />
                    <p>{fullName}</p>
                  </div>
                  <div>{renderButtonAction(user.currentUser!, user._id)}</div>
                </li>
              );
            })}
          </ul>
        </div>
        <label className="modal-backdrop" htmlFor="modal-search-user">
          Close
        </label>
      </div>
    </>
  );
};

export default ModalSearchUser;
