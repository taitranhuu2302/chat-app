import React, { useEffect, useRef, useState } from 'react';
import { BsFillMicFill, BsFillTelephoneFill } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';
import Portal from '../Portal';
import eventBus from '@/config/EventBus';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setModalVideoCall,
  setOpenModalVideoCalling,
} from '@/redux/features/ModalSlice';
import { usePeerContext } from 'contexts/PeerContext';
import { useSocketContext } from 'contexts/SocketContext';
import { SOCKET_EVENT } from '@/constants/Socket';
import { useAuthContext } from 'contexts/AuthContext';
import Avatar from 'react-avatar';
import Opacity from '@/components/Animation/Opacity';

interface IProps {}

const ModalCalledVideo: React.FC<IProps> = () => {
  const { openModalVideoCalling } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const { peer, peerId } = usePeerContext();
  const { modalVideoCall } = useAppSelector((state) => state.modal);
  const { socket } = useSocketContext();
  const localStream = useRef<MediaStream | null>(null);
  const { auth } = useAuthContext();
  const peers: any = {};
  const [conversationId, setConversationId] = useState('');
  const remoteStream = useRef<MediaStream | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isMute, setIsMute] = useState(false);

  useEffect(() => {
    if (!peer || !socket) return;

    if (openModalVideoCalling) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          addVideoStream(localVideoRef.current, stream);
          setIsWaiting(true);

          localStream.current = stream;

          peer.on('call', (call) => {
            call.answer(stream);
            call.on('stream', (stream) => {
              addVideoStream(remoteVideoRef.current, stream);
              remoteStream.current = stream;
              setIsWaiting(false);
            });
            call.on('close', () => {
              if (peers[peerId]) {
                peers[peerId].close();
              }
              const video = remoteVideoRef.current;
              if (video) {
                video.srcObject = null;
              }
            });
          });
        });
    }

    eventBus.on(SOCKET_EVENT.VIDEO.CALLING, (data: any) => {
      setConversationId(data.conversationId);
      setIsWaiting(false);
      localStream.current && connectToNewUser(data.peerId, localStream.current);
    });
    eventBus.on(SOCKET_EVENT.VIDEO.DISCONNECTED, (data: any) => {
      if (peers[data.peerId]) {
        peers[data.peerId].close();
      }
      const video = remoteVideoRef.current;
      if (video) {
        video.srcObject = null;
      }
    });

    return () => {
      eventBus.off(SOCKET_EVENT.VIDEO.CALLING);
      eventBus.off(SOCKET_EVENT.VIDEO.DISCONNECTED);
    };
  }, [peer, auth, openModalVideoCalling]);

  const connectToNewUser = (peerId: string, stream: MediaStream) => {
    const video = remoteVideoRef.current;
    if (!peer || !video) return;
    const call = peer.call(peerId, stream);

    call.on('stream', (userVideoStream) => {
      peers[peerId] = call;
      remoteStream.current = userVideoStream;
      addVideoStream(video, userVideoStream);
    });

    call.on('close', () => {
      if (peers[peerId]) {
        peers[peerId].close();
      }
      const video = remoteVideoRef.current;
      if (video) {
        video.srcObject = null;
      }
    });
  };

  const addVideoStream = (video: any, stream: MediaStream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  };

  const handleClose = () => {
    localStream.current?.getTracks().forEach((track) => {
      track.stop();
    });
    localStream.current = null;
    remoteStream.current?.getTracks().forEach((track) => {
      track.stop();
    });
    remoteStream.current = null;
    const video = localVideoRef.current;
    if (video) {
      video.srcObject = null;
    }
    socket?.emit(SOCKET_EVENT.VIDEO.USER_DISCONNECTED, {
      conversationId,
      peerId,
    });
    dispatch(setOpenModalVideoCalling(false));
    dispatch(
      setModalVideoCall({
        isOpen: false,
        userCall: null,
      })
    );
    window.location.reload();
  };

  return (
    <Portal>
      <div
        className={twMerge(
          'modal modal-override',
          openModalVideoCalling && 'active'
        )}>
        <div className="modal-box p-0 max-w-[1000px] dark:bg-via-600">
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle z-[5] bg-white absolute right-2 top-2">
            ✕
          </button>
          <div className={'w-full h-[600px]'}>
            <div
              className={
                'absolute top-10 right-10 w-[150px] h-[100px] rounded-lg overflow-hidden shadow'
              }>
              <video
                ref={localVideoRef}
                poster="https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
                className="h-full w-full object-cover"></video>
            </div>
            <Opacity open={isWaiting}>
              <div
                className={
                  'absolute flex items-center gap-2.5 justify-center select-none font-semibold top-[100px] left-1/2 -translate-x-1/2 px-3 rounded-full py-2'
                }
                style={{ background: 'rgba(255,255,255,.8)' }}>
                <span>Waiting for connection</span>
                <span className={'loading loading-dots'}></span>
              </div>
            </Opacity>
            <video
              ref={remoteVideoRef}
              poster={
                'https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg'
              }
              className="h-full w-full object-cover"></video>
            <div
              className={
                'absolute left-1/2 -translate-x-1/2 bottom-5 flex items-center gap-5'
              }>
              <button
                className={'bg-gray-400 p-4 rounded-full hover:opacity-95'}>
                <BsFillMicFill className={'text-white'} size={23} />
              </button>
              <button
                onClick={handleClose}
                className={
                  'bg-red-500 p-4 block cursor-pointer rounded-full hover:opacity-95'
                }>
                <BsFillTelephoneFill className={'text-white'} size={23} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default ModalCalledVideo;
