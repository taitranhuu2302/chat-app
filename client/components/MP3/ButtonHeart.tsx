import React, { PropsWithChildren, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import styles from '@/styles/components/music.module.scss'
import useTranslate from '@/hooks/useTranslate';
interface IProps {}

const ButtonHeart: React.FC<PropsWithChildren<IProps>> = () => {
  const [isFavourite, setIsFavourite] = useState(false);
  const t = useTranslate()

  return (
    <>
      <button className={`${styles.btnHeart} tooltip tooltip-top`} data-tip={t.favourite} onClick={() => setIsFavourite((e) => !e)}>
        {isFavourite ? (
          <AiFillHeart className={'text-[#8b45ca]'} size={20} />
        ) : (
          <AiOutlineHeart size={20} />
        )}
      </button>
    </>
  );
};

export default ButtonHeart;
