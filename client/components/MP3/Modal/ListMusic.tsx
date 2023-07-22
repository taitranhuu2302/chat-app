import React from 'react';
import SongItem from './SongItem';

interface IProps {}

const ListMusic: React.FC<IProps> = () => {

  return (
    <>
      <div className={'h-full flex-center'}>
        <SongItem />
      </div>
    </>
  );
};

export default ListMusic;
