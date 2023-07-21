import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuthContext } from './AuthContext';
import Peer, { MediaConnection } from 'peerjs';
import eventBus from '@/config/EventBus';
import { SOCKET_EVENT } from '@/constants/Socket';
import { setModalVideoCall } from '@/redux/features/ModalSlice';
import { useSocketContext } from './SocketContext';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';

export type PeerContextType = {
  peerId: string;
  peer: Peer | null;
  getUserMedia: (
    constraints?: MediaStreamConstraints | undefined
  ) => Promise<MediaStream>;
};

export const PeerContext = createContext<null | PeerContextType>(null);

export const usePeerContext = () => useContext(PeerContext) as PeerContextType;

const PeerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [peerId, setPeerId] = useState('');
  const peerInstance = useRef<Peer | null>(null);
  const [mediaConfig, setMediaConfig] = useState({
    video: true,
    audio: false,
  });
  const dispatch = useAppDispatch();
  const { socket } = useSocketContext();
  const getUserMedia = (constraints?: MediaStreamConstraints | undefined) =>
    navigator.mediaDevices.getUserMedia({
      ...mediaConfig,
      ...constraints,
    });
  const { auth } = useAuthContext();

  useEffect(() => {
    if (!auth || !socket) return;
    const peer = new Peer(auth._id, {
      host: 'localhost',
      port: 9000,
      path: '/',
    });

    peer.on('open', (id: string) => {
      setPeerId(id);
    });

    socket.on(SOCKET_EVENT.VIDEO.CALLING, (data) => {
      if (data.user._id === auth?._id) return;
      if (!data.isJoin) {
        dispatch(
          setModalVideoCall({
            isOpen: true,
            type: 'Request',
            userCall: data.user,
            conversationId: data.conversationId
          })
        );
      }
      setTimeout(() => {
        eventBus.emit(SOCKET_EVENT.VIDEO.CALLING, data)
      }, 500)
    });

    socket.on(SOCKET_EVENT.VIDEO.DISCONNECTED, (data: any) => {
      setTimeout(() => {
        eventBus.emit(SOCKET_EVENT.VIDEO.DISCONNECTED, data)
      }, 500)
    })

    peerInstance.current = peer;

    return () => {
      socket.off(SOCKET_EVENT.VIDEO.CALLING)
      socket.off(SOCKET_EVENT.VIDEO.DISCONNECTED)
    }
  }, [auth, socket, eventBus]);

  return (
    <PeerContext.Provider
      value={{ peerId, peer: peerInstance.current, getUserMedia }}>
      {children}
    </PeerContext.Provider>
  );
};

export default PeerProvider;