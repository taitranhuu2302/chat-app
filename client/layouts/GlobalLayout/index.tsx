import React, {
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/redux/hooks';
import {
  onOpenMusic,
  setConfigDefaultMusic,
} from '@/redux/features/MusicSlice';
import { useRouter } from 'next/router';
import AudioMusic from '@/components/MP3/AudioMusic';
import Hotkey from '@/components/Hotkey';

interface IProps {}

const GlobalLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const constraintsRef = useRef<any>(null);
  const dispatch = useAppDispatch();
  const [dragStart, setDragStart] = useState<number>(0);
  const router = useRouter();

  const onMouseDown = (event: any) => {
    setDragStart(new Date().getTime());
  };

  useEffect(() => {
    dispatch(setConfigDefaultMusic());
  }, []);

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
