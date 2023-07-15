import Peer from 'peerjs';
import React, { useEffect, useRef, useState } from 'react';
import { BsFillMicFill, BsFillTelephoneFill } from 'react-icons/bs';
import Portal from '../Portal';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'next/router';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const ModalCalledVideo: React.FC<IProps> = ({ open, onClose }) => {
  const [peerId, setPeerId] = useState("")
  const router = useRouter()
  const { query: { id } } = router;
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerInstance = useRef<Peer | null>(null);
  const getUserMedia = navigator.mediaDevices.getUserMedia;
  const [mediaConfig, setMediaConfig] = useState({
    video: true,
    audio: false,
  })

  useEffect(() => {
    if (!id) return;

    const peer = new Peer({
      host: 'localhost',
      port: 9000,
      path: "/",
    });

    peer.on('open', (id) => {
      setPeerId(id)
    })

    peer.on('call', async (call) => {
      if (window.confirm("Bạn có muốn chấp nhận cuộc gọi ?")) {
        const stream = await getUserMedia(mediaConfig);
        const videoLocal = localVideoRef.current;
        const videoRemote = remoteVideoRef.current;
        if (!videoLocal || !videoRemote) return;
        videoLocal.srcObject = stream;
        videoLocal.play();

        call.answer(stream);
        call.on('stream', (remoteStream) => {
          videoRemote.srcObject = remoteStream;
          videoRemote.play();
        });
      }
    });


    peerInstance.current = peer;
  }, [getUserMedia, localVideoRef, id])

  const onJoinRoom = async (remotePeerId: string) => {
    try {
      const peer = peerInstance.current;

      if (!peer) return;

      const stream = await getUserMedia(mediaConfig);

      const videoLocal = localVideoRef.current;
      const videoRemote = remoteVideoRef.current;

      if (!videoLocal || !videoRemote) return;
      videoLocal.srcObject = stream;
      videoLocal.play();

      const call = peer.call(remotePeerId, stream);

      call.on('stream', (remoteStream) => {
        videoRemote.srcObject = remoteStream;
        videoRemote.play();
      });

    } catch (e) {
      console.log(e);
    }
  };

  const handleClose = () => {
    onClose()
  }

  return (
    <Portal>
      <div className={twMerge('modal modal-override', open && 'active')}>
        <div className="modal-box p-0 max-w-[1000px] dark:bg-via-600">
          <button
            onClick={handleClose}
            className="btn btn-sm btn-circle z-[5] bg-white absolute right-2 top-2">
            ✕
          </button>
          <div className={'w-full h-[600px]'}>
            <div className={'absolute top-10 right-10 w-[150px] h-[100px] rounded-lg overflow-hidden shadow'}>
              <video ref={remoteVideoRef} poster='https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg' className='h-full w-full object-cover'></video>
            </div>
            <video ref={localVideoRef} poster='https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg' className='h-full w-full object-cover'></video>
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
