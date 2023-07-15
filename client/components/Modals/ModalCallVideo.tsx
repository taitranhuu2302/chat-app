import React, { useContext, useEffect, useState } from 'react';
import Avatar from 'react-avatar';
import { IoClose } from 'react-icons/io5';
import { BsCameraVideo, BsCameraVideoFill } from 'react-icons/bs';
import useTranslate from '@/hooks/useTranslate';
import dynamic from 'next/dynamic';
import { useGetConversationById } from '@/service/ConversationService';
import Portal from '../Portal';
import { PeerContext, PeerContextType } from 'contexts/PeerContext';
const ModalCalledVideoDynamic = dynamic(() => import("@/components/Modals/ModalCalledVideo"), { ssr: false })

interface IModalCallVideo {
  user: UserType
}

const ModalCallVideo: React.FC<IModalCallVideo> = ({ user }) => {
  const t = useTranslate();
  const [openCalledVideo, setOpenCalledVideo] = useState(false)
  const { onCallVideo } = useContext(PeerContext) as PeerContextType;

  return <>
    <Portal>
      <div>
        <input type="checkbox" id="modal-call-video" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box dark:bg-via-600 flex-center flex-col">
            <Avatar name={'Tran Huu Tai'} round size={'100px'} />
            <p className={'text-lg mt-5 font-bold'}>{user.firstName} {user.lastName}</p>
            <p className={'text-sm mt-2.5 dark:text-via-500'}>{t.home.room.header.videoCall.description}</p>
            <div className="modal-action gap-5 mt-8">
              <label htmlFor="modal-call-video" className="bg-error p-4 rounded-full cursor-pointer flex-center">
                <IoClose size={20} color={'white'} />
              </label>
              <button onClick={() => {
                setOpenCalledVideo(true)
                onCallVideo(user._id)
              }} className="bg-success p-4 rounded-full cursor-pointer flex-center">
                <BsCameraVideoFill size={20} color={'white'} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Portal>
    <ModalCalledVideoDynamic open={openCalledVideo} onClose={() => setOpenCalledVideo(false)} />
  </>
}

export default ModalCallVideo;
