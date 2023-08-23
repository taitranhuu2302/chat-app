import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  onOpenMusic,
  setConfigDefaultMusic,
  setIsPlaying,
  setSongChange,
  setVolume,
} from '@/redux/features/MusicSlice';
import { useRouter } from 'next/router';
import AudioMusic from '@/components/MP3/AudioMusic';
import Hotkey from '@/components/Hotkey';
import { HOT_KEYS } from '@/constants/Hotkey';
import { onOpenHotkey } from '@/redux/features/HotkeySlice';

interface IProps {}

const GlobalLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const constraintsRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const [dragStart, setDragStart] = useState<number>(0);
  const router = useRouter();
  const isDisabledHotkey = useAppSelector(
    (state) => state.hotkey.isDisabledHotkey
  );

  const onMouseDown = () => {
    setDragStart(new Date().getTime());
  };

  useEffect(() => {
    dispatch(setConfigDefaultMusic());
  }, []);
  const checkKey = (key: string, hasKey: string) => {
    return key === hasKey;
  };

  const onChangeTab = useCallback(
    async (tabText: string, path?: string) => {
      await router.replace({
        pathname: path
          ? path
          : router.pathname === '/settings'
          ? '/'
          : router.pathname,
        query: { ...router.query, tab: tabText },
      });
    },
    [router]
  );

  const handleHotkey = useCallback(async (event: KeyboardEvent) => {
    event.preventDefault();
    const key = event.key;
    const ctrl = event.ctrlKey;

    switch (true) {
      case ctrl && checkKey(key, 'h'):
        dispatch(onOpenHotkey());
        break;
      case ctrl && checkKey(key, 'o'):
        dispatch(onOpenMusic());
        break;
      case ctrl && checkKey(key, 'p'):
        dispatch(setIsPlaying(null));
        break;
      case ctrl && checkKey(key, 'ArrowRight'):
        dispatch(setSongChange('Next'));
        break;
      case ctrl && checkKey(key, 'ArrowLeft'):
        dispatch(setSongChange('Previous'));
        break;
      case ctrl && checkKey(key, 'm'):
        dispatch(setVolume());
        break;
      case ctrl && checkKey(key, '1'):
        await onChangeTab('profile')
        break;
      case ctrl && checkKey(key, '2'):
        await onChangeTab('chat')
        break;
      case ctrl && checkKey(key, '3'):
        await onChangeTab('pending')
        break;
      case ctrl && checkKey(key, '4'):
        await onChangeTab('contact')
        break;
      case ctrl && checkKey(key, '5'):
        await onChangeTab('setting', '/settings')
        break;
      default:
        break;
    }
  }, [onChangeTab]);

  useEffect(() => {
    if (isDisabledHotkey) return;
    window.addEventListener('keydown', handleHotkey);
    return () => {
      window.removeEventListener('keydown', handleHotkey);
    };
  }, [handleHotkey, isDisabledHotkey]);

  const onMouseUp = () => {
    if (new Date().getTime() - dragStart < 150) {
      dispatch(onOpenMusic(true));
    }
  };

  const isAuthRoute = useMemo(
    () => router.pathname.startsWith('/auth'),
    [router]
  );

  return (
    <motion.div ref={constraintsRef}>
      {!isAuthRoute && (
        <motion.div
          onMouseUp={onMouseUp}
          onMouseDown={onMouseDown}
          className="fixed z-[1000] opacity-40 hover:opacity-100 cursor-pointer"
          drag
          dragConstraints={constraintsRef}>
          <picture>
            <img
              className="pointer-events-none w-[60px] rounded-2xl"
              src="https://i02.appmifile.com/images/2018/01/25/2e1ac247-ef54-47c4-b899-9d5b01a933ab.png"
              alt=""
            />
          </picture>
        </motion.div>
      )}
      {children}
      {!isAuthRoute && <AudioMusic />}
      <Hotkey />
    </motion.div>
  );
};

export default GlobalLayout;
