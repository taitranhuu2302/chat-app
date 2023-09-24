import useTranslate from '@/hooks/useTranslate';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import Avatar from 'react-avatar';
import { BsCameraVideoFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import Portal from '../Portal';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  setModalVideoCall,
  setOpenModalVideoCalling,
} from '@/redux/features/ModalSlice';
import { twMerge } from 'tailwind-merge';
import { useSocketContext } from 'contexts/SocketContext';
import { SOCKET_EVENT } from '@/constants/Socket';
import { usePeerContext } from 'contexts/PeerContext';
import { useAuthContext } from 'contexts/AuthContext';
import {useRouter} from "next/router";

interface IModalCallVideo {

}

const ModalCallVideo: React.FC<IModalCallVideo> = () => {
  const t = useTranslate();
  const dispatch = useAppDispatch();
  const { socket } = useSocketContext();
  const { peerId } = usePeerContext();
  const { auth } = useAuthContext();
  const { modalVideoCall } = useAppSelector((state) => state.modal);
  const {conversation, userOther} = useAppSelector(state => state.conversation)

  const handleCall = async () => {
    dispatch(setOpenModalVideoCalling(true));
    socket &&
      socket.emit(SOCKET_EVENT.VIDEO.JOIN, {
        peerId,
        conversationId: modalVideoCall.conversationId || conversation?._id,
        user: auth,
        isJoin: !!modalVideoCall.conversationId
      });
    handleClose();
  };

  const handleClose = () => {
    dispatch(
      setModalVideoCall({
        isOpen: false,
      })
    );
  };

  return (
    <>
      <Portal>
        <div>
          <div
            className={twMerge(
              'modal modal-override',
              modalVideoCall.isOpen && 'active'
            )}>
            <div className="modal-box dark:bg-via-600 flex-center flex-col">
              {
                modalVideoCall.userCall ? (
                  <>
                    <Avatar name={`${modalVideoCall.userCall.firstName} ${modalVideoCall.userCall.lastName}`} round size={'100px'} />
                    <p className={'text-lg mt-5 font-bold'}>
                      {modalVideoCall.userCall.firstName} {modalVideoCall.userCall.lastName}
                    </p>
                  </>
                ) : (
                  <>
                    <Avatar name={`${userOther?.firstName} ${userOther?.lastName}`} round size={'100px'} />
                    <p className={'text-lg mt-5 font-bold'}>
                      {userOther?.firstName} {userOther?.lastName}
                    </p>
                  </>
                )
              }
              <p className={'mt-2.5 dark:text-via-500 flex items-center gap-2.5'}>
                {modalVideoCall.type === 'Request' ? (
                  <>
                    <span>{t.home.room.header.videoCall.calling}</span>
                    <span className="loading loading-dots loading-md"></span>
                  </>
                ) : (
                  t.home.room.header.videoCall.description
                )}
              </p>
              <div className="modal-action gap-5 mt-8">
                <button
                  onClick={handleClose}
                  className="bg-error p-4 rounded-full cursor-pointer flex-center">
                  <IoClose size={20} color={'white'} />
                </button>
                <button
                  onClick={handleCall}
                  className="bg-success p-4 rounded-full cursor-pointer flex-center">
                  <BsCameraVideoFill size={20} color={'white'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
};

export default ModalCallVideo;
