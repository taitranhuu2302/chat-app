import useTranslate from '@/hooks/useTranslate';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { BsCameraVideoFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import Portal from '../Portal';
import { useAppDispatch } from '@/redux/hooks';
import { setOpenModalVideoCalling } from '@/redux/features/ModalSlice';
import { twMerge } from 'tailwind-merge';
import { useSocketContext } from 'contexts/SocketContext';
import { SOCKET_EVENT } from '../../constants/Socket';
import { usePeerContext } from 'contexts/PeerContext';
import { useAuthContext } from 'contexts/AuthContext';

interface IModalCallVideo {
  user: UserType;
  open: boolean;
  onClose: () => void;
  conversation: ConversationType
}

const ModalCallVideo: React.FC<IModalCallVideo> = ({ user, open, onClose, conversation }) => {
  const t = useTranslate();
  const dispatch = useAppDispatch()
  const { socket } = useSocketContext()
  const { peerId } = usePeerContext()
  const { auth } = useAuthContext()

  const handleCall = () => {
    dispatch(setOpenModalVideoCalling(true))
    socket && socket.emit(SOCKET_EVENT.VIDEO.JOIN, {
      peerId,
      conversationId: conversation._id,
      userId: auth?._id
    })
    onClose()
  }

  return <>
    <Portal>
      <div>
        <div className={twMerge('modal modal-override', open && 'active')}>
          <div className="modal-box dark:bg-via-600 flex-center flex-col">
            <Avatar name={'Tran Huu Tai'} round size={'100px'} />
            <p className={'text-lg mt-5 font-bold'}>{user.firstName} {user.lastName}</p>
            <p className={'text-sm mt-2.5 dark:text-via-500'}>{t.home.room.header.videoCall.description}</p>
            <div className="modal-action gap-5 mt-8">
              <button onClick={onClose} className="bg-error p-4 rounded-full cursor-pointer flex-center">
                <IoClose size={20} color={'white'} />
              </button>
              <button onClick={handleCall} className="bg-success p-4 rounded-full cursor-pointer flex-center">
                <BsCameraVideoFill size={20} color={'white'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
  </>
}

export default ModalCallVideo;
