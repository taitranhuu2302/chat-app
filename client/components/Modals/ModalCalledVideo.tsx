import React, { useRef } from 'react';
import { BsFillMicFill, BsFillTelephoneFill } from 'react-icons/bs';
import { twMerge } from 'tailwind-merge';
import Portal from '../Portal';

interface IProps {
  open: boolean;
  onClose: () => void;
}

const ModalCalledVideo: React.FC<IProps> = ({ open, onClose }) => {
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const localVideoRef = useRef<HTMLVideoElement | null>(null)

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
