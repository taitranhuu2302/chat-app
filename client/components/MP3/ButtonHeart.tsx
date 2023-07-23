import React, { PropsWithChildren, useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import styles from '@/styles/components/music.module.scss'
interface IProps {}

const ButtonHeart: React.FC<PropsWithChildren<IProps>> = () => {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <>
      <button className={styles.btnHeart} onClick={() => setIsFavourite((e) => !e)}>
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
