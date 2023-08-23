import { AnimatePresence, motion } from 'framer-motion';
import React, { Fragment, PropsWithChildren, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import styles from '@/styles/components/hotkey.module.scss';
import { IoClose } from 'react-icons/io5';
import { onOpenHotkey } from '@/redux/features/HotkeySlice';
import {useOnClickOutside} from "usehooks-ts";
import {HOT_KEYS} from "@/constants/Hotkey";

interface IProps {}

const Hotkey: React.FC<PropsWithChildren<IProps>> = () => {
  const { open } = useAppSelector((state) => state.hotkey);
  const dispatch = useAppDispatch();
  const modalRef = useRef<HTMLDivElement | null>(null);
  
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
              <p className={styles.title}>Keyboard shortcuts</p>
              <button onClick={() => dispatch(onOpenHotkey(false))}>
                <IoClose size={25} />
              </button>
            </div>
            <div className={styles.content}>
              {HOT_KEYS.map((item, index) => (
                <HotkeyItem key={index} hotkey={item} />
              ))}
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
