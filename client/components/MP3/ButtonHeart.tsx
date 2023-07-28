import React, {
  memo,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import styles from '@/styles/components/music.module.scss';
import useTranslate from '@/hooks/useTranslate';
import { useFavourite } from '@/hooks/useFavourite';
import { useAppSelector } from '@/redux/hooks';

interface IProps {
  song: SongInfoType;
}

const ButtonHeart: React.FC<PropsWithChildren<IProps>> = memo(
  function ButtonHeart({ song }) {
    const t = useTranslate();
    const { onToggleFavourite } = useFavourite();
    const favourite = useAppSelector((state) => state.music.favourite);
    const isFavourite = useMemo(() => {
      return !!favourite.find((item) => item.song.encodeId === song.encodeId);
    }, [favourite, song]);

    const handleToggleFavourite = useCallback(async () => {
      await onToggleFavourite(song);
    }, [song]);

    return (
      <>
        <button
          datatype={'heart'}
          className={`${styles.btnHeart} tooltip tooltip-top`}
          data-tip={t.favourite}
          onClick={handleToggleFavourite}>
          {isFavourite ? (
            <AiFillHeart className={'text-[#8b45ca]'} size={20} />
          ) : (
            <AiOutlineHeart size={20} />
          )}
        </button>
      </>
    );
  }
);

export default ButtonHeart;
