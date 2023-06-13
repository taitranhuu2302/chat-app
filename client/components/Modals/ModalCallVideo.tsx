import React from 'react';
import Avatar from 'react-avatar';
import {IoClose} from 'react-icons/io5';
import {BsCameraVideo, BsCameraVideoFill} from 'react-icons/bs';
import useTranslate from '@/hooks/useTranslate';
import ModalCalledVideo from "@/components/Modals/ModalCalledVideo";

interface IModalCallVideo {

}

const ModalCallVideo: React.FC<IModalCallVideo> = () => {
const t= useTranslate();

  return <>
      <div>
        <input type="checkbox" id="modal-call-video" className="modal-toggle" />
        <div className="modal">
          <div className="modal-box dark:bg-via-600 flex-center flex-col">
            <Avatar name={'Tran Huu Tai'} round size={'100px'}/>
            <p className={'text-lg mt-5 font-bold'}>Tran Huu Tai</p>
            <p className={'text-sm mt-2.5 dark:text-via-500'}>{t.home.room.header.videoCall.description}</p>
            <div className="modal-action gap-5 mt-8">
              <label htmlFor="modal-call-video" className="bg-error p-4 rounded-full cursor-pointer flex-center">
                <IoClose size={20} color={'white'}/>
              </label>
              <label htmlFor="modal-called-video" className="bg-success p-4 rounded-full cursor-pointer flex-center">
                <BsCameraVideoFill size={20} color={'white'}/>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
}

export default ModalCallVideo;