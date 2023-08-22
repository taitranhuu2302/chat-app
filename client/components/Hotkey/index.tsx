import { AnimatePresence, motion } from 'framer-motion';
import React, { Fragment, PropsWithChildren, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import styles from '@/styles/components/hotkey.module.scss';
import { IoClose } from 'react-icons/io5';
import { onOpenHotkey } from '@/redux/features/HotkeySlice';
import {useOnClickOutside} from "usehooks-ts";

interface IProps {}

type HotkeyType = {
  name: string;
  keys: string[];
};

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
              {hotkeys.map((item, index) => (
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
        {hotkey.keys.map((item, index) => {
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

const hotkeys: HotkeyType[] = [
  {
    name: 'Open popup music',
    keys: ['Ctrl', 'm'],
  },
  {
    name: 'Play song',
    keys: ['Ctrl', 'p'],
  },
  {
    name: 'Pause song',
    keys: ['Ctrl', 'Shift', 'p'],
  },
  {
    name: 'Next song',
    keys: ['Ctrl', '▶︎'],
  },
  {
    name: 'Previous song',
    keys: ['Ctrl', '◀︎'],
  },
  {
    name: 'Increase volume',
    keys: ['Ctrl', '▲'],
  },
  {
    name: 'Decrease volume',
    keys: ['Ctrl', '▼'],
  },
  {
    name: 'Toggle mute',
    keys: ['Ctrl', 'Alt', 'm'],
  },
  {
    name: 'Tab 1',
    keys: ['Ctrl', 'Shift', '1'],
  },
  {
    name: 'Tab 2',
    keys: ['Ctrl', 'Shift', '2'],
  },
  {
    name: 'Tab 3',
    keys: ['Ctrl', 'Shift', '3'],
  },
  {
    name: 'Tab 4',
    keys: ['Ctrl', 'Shift', '4'],
  },
];
export default Hotkey;
