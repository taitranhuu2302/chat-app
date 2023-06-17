import React from 'react';
import Avatar from 'react-avatar';
import { RxDotFilled } from 'react-icons/rx';

interface IAvatarCustom {
  src?: string;
  name?: string;
  isActive?: boolean;
}

const AvatarCustom: React.FC<IAvatarCustom> = ({ src, name, isActive }) => {
  return (
    <>
      <div className={'flex-center flex-col gap-2.5 mt-5'}>
        <Avatar round size={'80px'} name={name} src={src} />
        <p className={'text-lg font-bold mt-5'}>{name}</p>
        <div className={'flex-center'}>
          <RxDotFilled size={20} className={'text-success'} />
          <span className={'text-success text-md font-medium'}>Active</span>
        </div>
      </div>
    </>
  );
};

export default AvatarCustom;
