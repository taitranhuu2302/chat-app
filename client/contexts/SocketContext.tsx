import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { getToken } from '@/service/AuthService';
import { useGetCountRequestFriendApi } from '@/service/UserService';
import { useAppDispatch } from '@/redux/hooks';
import {
  setCountRequestFriend,
  setUserOnline,
} from '@/redux/features/NotifySlice';
import { SOCKET_EVENT } from '@/constants/Socket';
import { AuthContext, AuthContextType } from './AuthContext';

export type SocketContextType = {
  socket: Socket | null;
};

export const SocketContext = createContext<SocketContextType | null>(null);

const SocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { auth } = useContext(AuthContext) as AuthContextType;
  const dispatch = useAppDispatch();
  useGetCountRequestFriendApi({
    onSuccess: ({ data }: any) => {
      dispatch(setCountRequestFriend(data));
    },
  });
  useEffect(() => {
    const url = process.env.SERVER_URL;
    if (!url) return;
    const { accessToken } = getToken();
    const newSocket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    newSocket.on(SOCKET_EVENT.USER.COUNT_FRIEND_REQUEST, (data: number) => {
      dispatch(setCountRequestFriend(data));
    });
    newSocket.on(SOCKET_EVENT.USER_CONNECTED, (data) => {
      dispatch(setUserOnline(data));
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [auth]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
