import React, { PropsWithChildren } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setPlayList, setSongCurrent } from '@/redux/features/MusicSlice';
import ButtonHeart from '@/components/MP3/ButtonHeart';
import { AiFillDelete } from 'react-icons/ai';

interface IProps {
  song: SongInfoType;
  callback?: (song: SongInfoType) => void;
  isHeart?: boolean;
  onDeleteCallback?: (song: SongInfoType) => void;
}

export const SongSearchItem: React.FC<IProps> = ({
  song,
  callback,
  onDeleteCallback ,
  isHeart = true,
}) => {
  const dispatch = useAppDispatch();

  const handleChooseSong = () => {
    if (callback) {
      callback(song);
      return;
    }
    dispatch(setSongCurrent(song));
    dispatch(
      setPlayList({
        items: [],
        type: 'search',
        isDefaultSong: false,
      })
    );
  };

  return (
    <li
      className={
        'p-2.5 hover:bg-[#493961] rounded flex items-center justify-between'
      }>
      <div className={'flex items-center gap-2.5'}>
        <picture className={'cursor-pointer'} onClick={handleChooseSong}>
          <img
            className={'w-[52px] h-[52px] rounded'}
            src={song.thumbnailM}
            alt=""
          />
        </picture>
        <div>
          <p
            className={'font-semibold cursor-pointer text-white'}
            onClick={handleChooseSong}>
            {song.title}
          </p>
          <p className={'text-[13px] text-[#988fa5]'}>{song.artistsNames}</p>
        </div>
      </div>
      {isHeart && <ButtonHeart song={song} />}
      {onDeleteCallback && (
        <button onClick={() => onDeleteCallback && onDeleteCallback(song)}>
          <AiFillDelete size={25} color={'white'}/>
        </button>
      )}
    </li>
  );
};

export default SongSearchItem;
