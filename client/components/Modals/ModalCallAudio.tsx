import React from 'react';
import Avatar from 'react-avatar';
import { BiPhone } from 'react-icons/bi';
import { BsTelephoneFill } from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import useTranslate from '@/hooks/useTranslate';

interface IModalCallAudio {}

const ModalCallAudio: React.FC<IModalCallAudio> = () => {
  const t = useTranslate();
  
  return <>
    <div>
      <label data-tip={t.home.room.header.audioCall.label} className={'tooltip tooltip-bottom cursor-pointer'} htmlFor={'modal-call-audio'}><BiPhone size={22} /></label>
      <input type='checkbox' id='modal-call-audio' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box dark:bg-via-600 flex-center flex-col'>
          <Avatar name={'Tran Huu Tai'} round size={'100px'} />
          <p className={'text-lg mt-5 font-bold'}>Tran Huu Tai</p>
          <p className={'text-sm mt-2.5 dark:text-via-500'}>{t.home.room.header.audioCall.description}</p>
          <div className='modal-action gap-5 mt-8'>
            <label htmlFor='modal-call-audio' className='bg-error p-4 rounded-full cursor-pointer flex-center'>
              <IoClose size={20} color={'white'}/>
            </label>
            <label htmlFor='modal-call-audio' className='bg-success p-4 rounded-full cursor-pointer flex-center'>
              <BsTelephoneFill size={20} color={'white'}/>
            </label>
          </div>
        </div>
      </div>
    </div>
  </>;
};

export default ModalCallAudio;