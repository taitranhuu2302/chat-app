import {
  onOpenMusic,
  setPlayList,
  setSongCurrent,
} from '@/redux/features/MusicSlice';
import { useAppDispatch } from '@/redux/hooks';
import { useSearchSong } from '@/service/MusicService';
import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoSearchOutline } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import { twMerge } from 'tailwind-merge';
import { useDebounce, useOnClickOutside } from 'usehooks-ts';
import ButtonHeart from './ButtonHeart';

interface IProps {}

const Header: React.FC<IProps> = () => {
  const dispatch = useAppDispatch();
  const [isFocusSearch, setIsFocusSearch] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [searchSongs, setSearchSongs] = useState<SongInfoType[]>([]);
  const keywordDebounce = useDebounce(keyword, 500);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const { isLoading } = useSearchSong({
    keyword: keywordDebounce,
    options: {
      onSuccess: ({ data }: { data: SearchType }) => {
        data.songs && setSearchSongs(data.songs);
      },
    },
  });

  useEffect(() => {
    if (!keywordDebounce) {
      setSearchSongs([]);
    }
  }, [keywordDebounce]);

  useOnClickOutside(searchRef, () => {
    setIsFocusSearch(false);
    setKeyword("")
  });

  return (
    <div className="flex items-center justify-between">
      <div
        className={twMerge(
          'flex max-w-[440px] w-full relative items-center bg-[#30293b] h-[40px] rounded-[20px] px-2',
          isFocusSearch && 'bg-[#34224f] rounded-bl-none rounded-br-none'
        )}
        ref={searchRef}
        onFocus={() => setIsFocusSearch(true)}>
        <button>
          <IoSearchOutline color="white" size={25} />
        </button>
        <input
          type="text"
          className="flex-grow outline-none pl-2.5 pr-5 border-none bg-transparent text-white"
          placeholder="Tìm kiếm bài hát"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        {isFocusSearch && (
          <div
            className={
              'absolute top-full left-0 bg-[#34224f] w-full px-3 pt-1 pb-3 rounded-bl-[20px] rounded-br-[20px] z-[1000]'
            }>
            <div className={'mt-2 space-y-2 max-h-[400px] overflow-y-auto transition-all duration-500 overflow-x-hidden'}>
              <p className={'font-bold text-[14px]'}>Gợi ý kết quả</p>
              <ul>
                {isLoading &&
                  Array(5)
                    .fill(0)
                    .map((_, index) => {
                      return <SearchSongSkeleton key={index} />;
                    })}
                {searchSongs.map((item) => {
                  return <SongSearchItem key={item.encodeId} song={item} />;
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2.5">
        <button
          className="bg-white w-[40px] hover:opacity-90 h-[40px] rounded-full flex-center"
          onClick={() => dispatch(onOpenMusic(false))}>
          <IoClose color={'black'} size={25} />
        </button>
      </div>
    </div>
  );
};

interface ISongSearchItem {
  song: SongInfoType;
}

const SearchSongSkeleton = () => {
  return (
    <li
      className={
        'p-2.5 hover:bg-[#493961] rounded flex items-center justify-between'
      }>
      <div className={'flex items-center gap-2.5'}>
        <Skeleton width={52} height={52} />
        <div className={'flex justify-center items-center gap-2 flex-col'}>
          <Skeleton width={100} height={20} />
          <Skeleton width={100} height={15} />
        </div>
      </div>
      <Skeleton width={20} height={20} />
    </li>
  );
};

const SongSearchItem: React.FC<ISongSearchItem> = ({ song }) => {
  const dispatch = useAppDispatch();

  const handleChooseSong = () => {
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
            className={'font-semibold cursor-pointer'}
            onClick={handleChooseSong}>
            {song.title}
          </p>
          <p className={'text-[13px] text-[#988fa5]'}>{song.artistsNames}</p>
        </div>
      </div>
      <ButtonHeart song={song}/>
    </li>
  );
};

export default Header;
