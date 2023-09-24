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

export const useSocketContext = () => useContext(SocketContext) as SocketContextType;

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
    if (!url || !auth) return;
    const { accessToken } = getToken();
    const newSocket = io(url, {
      extraHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [auth]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_EVENT.USER.COUNT_FRIEND_REQUEST, (data: number) => {
      dispatch(setCountRequestFriend(data));
    });

    socket.on(SOCKET_EVENT.USER_CONNECTED, (data) => {
      dispatch(setUserOnline(data));
    });

    return () => {
      socket.off(SOCKET_EVENT.USER.COUNT_FRIEND_REQUEST);
      socket.off(SOCKET_EVENT.USER_CONNECTED);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
