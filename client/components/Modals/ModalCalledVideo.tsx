import React from 'react';
import { BsFillMicFill, BsFillTelephoneFill } from 'react-icons/bs';

interface IProps {}

const ModalCalledVideo: React.FC<IProps> = () => {
  return (
    <>
      <input type="checkbox" id="modal-called-video" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box p-0 max-w-[1000px] dark:bg-via-600">
          <label
            htmlFor="modal-called-video"
            className="btn btn-sm btn-circle bg-white btn-ghost absolute right-2 top-2">
            ✕
          </label>
          <div className={'w-full h-[600px]'}>
            <picture className={'absolute top-10 right-10 w-[150px] h-[100px] rounded-lg overflow-hidden shadow'}>
              <img
                  src="https://i.pinimg.com/videos/thumbnails/originals/21/75/05/217505de55ee41daf449a80f0a065b7a.0000000.jpg"
                  alt=""
                  className={'h-full object-cover'}
              />
            </picture>
            <picture>
              <img
                src="https://i.pinimg.com/videos/thumbnails/originals/21/75/05/217505de55ee41daf449a80f0a065b7a.0000000.jpg"
                alt=""
                className={'h-full object-cover'}
              />
            </picture>
            <div
              className={
                'absolute left-1/2 -translate-x-1/2 bottom-5 flex items-center gap-5'
              }>
              <button
                className={'bg-gray-400 p-4 rounded-full hover:opacity-95'}>
                <BsFillMicFill className={'text-white'} size={23} />
              </button>
              <label
                htmlFor={'modal-called-video'}
                className={
                  'bg-red-500 p-4 block cursor-pointer rounded-full hover:opacity-95'
                }>
                <BsFillTelephoneFill className={'text-white'} size={23} />
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalCalledVideo;
