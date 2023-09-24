import { AnimatePresence, motion } from 'framer-motion';
import React, { Fragment, PropsWithChildren, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import styles from '@/styles/components/hotkey.module.scss';
import { IoClose } from 'react-icons/io5';
import { onOpenHotkey } from '@/redux/features/HotkeySlice';
import { useOnClickOutside } from "usehooks-ts";
import { HOT_KEYS, HOT_KEYS_VI } from "@/constants/Hotkey";
import useTranslate from '@/hooks/useTranslate';
import { useRouter } from 'next/router';

interface IProps { }

const Hotkey: React.FC<PropsWithChildren<IProps>> = () => {
  const { open } = useAppSelector((state) => state.hotkey);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement | null>(null);
  const t: any = useTranslate()
  const { locale } = useRouter();

  useOnClickOutside(modalRef, () => {
    dispatch(onOpenHotkey(false))
  })


  return (
    <AnimatePresence>
      {open && (
        <div className={`${styles.root}`}>
          <motion.div
            ref={modalRef}
            initial={{ y: '150%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
            exit={{ y: '150%' }}
            className={`${styles.modal} dark:bg-via-200 bg-white`}>
            <div className={styles.header}>
              <p className={styles.title}>{t.helpMessageSendSong}</p>
              <button onClick={() => dispatch(onOpenHotkey(false))}>
                <IoClose size={25} />
              </button>
            </div>
            <ul className='mb-5 list-disc pl-5'>
              <li>{t.usageSong}</li>
              <li>{t.searchSong}</li>
              <li>{t.selectSong}</li>
              <li>{t.receiveMessageSong}</li>
            </ul>
            <div className={styles.header}>
              <p className={styles.title}>Keyboard shortcuts</p>
            </div>
            <div className={styles.content}>
              {locale === 'en' ? <>
                {HOT_KEYS.map((item, index) => (
                  <HotkeyItem key={index} hotkey={item} />
                ))}
              </> : <>
                {HOT_KEYS_VI.map((item, index) => (
                  <HotkeyItem key={index} hotkey={item} />
                ))}
              </>}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface IHotkeyItem {
  hotkey: HotkeyType;
}

const HotkeyItem: React.FC<IHotkeyItem> = ({ hotkey }) => {
  return (
    <div className={styles.contentItem}>
      <p className={'text-sm font-semibold'}>{hotkey.name}</p>
      <div className={'flex items-center gap-1'}>
        {hotkey.keymaps.map((item, index) => {
          if (index === 0) {
            return (
              <Fragment key={index}>
                <kbd className="kbd kbd-sm dark:bg-via-600">{item}</kbd>
              </Fragment>
            );
          }
          return (
            <Fragment key={index}>
              +<kbd className="kbd kbd-sm dark:bg-via-600">{item}</kbd>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};



export default Hotkey;
