import React, { useRef, useState, useEffect } from 'react';
import { BsFillMicFill, BsFillTelephoneFill } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';
import Portal from '../Portal';
import eventBus from '@/config/EventBus';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setOpenModalVideoCalling } from '@/redux/features/ModalSlice';
import { usePeerContext } from 'contexts/PeerContext';
import { useSocketContext } from 'contexts/SocketContext';
import ReactPlayer from 'react-player';
import { SOCKET_EVENT } from '@/constants/Socket';
import { useAuthContext } from 'contexts/AuthContext';
import { MediaConnection } from 'peerjs';

interface IProps {

}

const ModalCalledVideo: React.FC<IProps> = () => {
  const { openModalVideoCalling } = useAppSelector(state => state.modal)
  const dispatch = useAppDispatch()
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)
  const { peer, getUserMedia } = usePeerContext()
  const { socket } = useSocketContext()
  const localStream = useRef<MediaStream | null>(null)
  const { auth } = useAuthContext()


  useEffect(() => {
    if (!peer || !socket || !openModalVideoCalling) return;

    getUserMedia().then((stream) => {
      addVideoStream(localVideoRef.current, stream)
      
      localStream.current = stream;

      peer.on('call', (call) => {
        call.answer(stream)
        call.on('stream', stream => {
          addVideoStream(remoteVideoRef.current, stream)
        })
      })

      socket.on(SOCKET_EVENT.VIDEO.CALLING, (data) => {
        if (data.userId === auth?._id) return;
        dispatch(setOpenModalVideoCalling(true))
        connectToNewUser(data.peerId, stream)
      })
    })

    return () => {
      socket.off(SOCKET_EVENT.VIDEO.CALLING)
    }
  }, [peer, auth, openModalVideoCalling])

  const connectToNewUser = (peerId: string, stream: MediaStream) => {
    if (!peer || !remoteVideoRef.current) return;
    const call = peer.call(peerId, stream)
    const video = remoteVideoRef.current;

    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
      video.remove()
    })
  }


  function addVideoStream(video: any, stream: MediaStream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
  }

  const handleClose = () => {
    dispatch(setOpenModalVideoCalling(false))
    localStream.current?.getTracks().forEach(track => {
      track.stop()
    })
  }

  return (
    <Portal>
      <div className={twMerge('modal modal-override', openModalVideoCalling && 'active')}>
        <div className="modal-box p-0 max-w-[1000px] dark:bg-via-600">
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle z-[5] bg-white absolute right-2 top-2">
            ✕
          </button>
          <div className={'w-full h-[600px]'}>
            <div className={'absolute top-10 right-10 w-[150px] h-[100px] rounded-lg overflow-hidden shadow'}>
              <video ref={localVideoRef} poster='https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg' className='h-full w-full object-cover'></video>
              {/* {localStream ? <ReactPlayer url={localStream} /> : (
                <picture><img className='object-cover h-full w-full' src="https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg" alt="" /></picture>
              )} */}
            </div>
            <video ref={remoteVideoRef} poster='https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg' className='h-full w-full object-cover'></video>
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
