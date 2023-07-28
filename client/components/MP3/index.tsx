import React, {
  useMemo,
  useRef,
  useState,
  Suspense,
  lazy,
  useEffect,
} from 'react';
import Sidebar from './Sidebar';
import { useAppSelector } from '@/redux/hooks';
import { twMerge } from 'tailwind-merge';
import Header from './Header';
import Footer from '@/components/MP3/Footer';
import Library from '@/components/MP3/Library';
import { AnimatePresence, motion } from 'framer-motion';
import PanelLoading from '@/components/MP3/PanelLoading';
import { useRouter } from 'next/router';
import { useFavourite } from '@/hooks/useFavourite';

const Charts = lazy(() => import('./Charts'));

const MP3 = () => {
  const { open } = useAppSelector((state) => state.music);
  const [tabActive, setTabActive] = useState<SidebarMP3>('charts');
  const rootRef = useRef<HTMLDivElement | null>(null);
  const songCurrent = useAppSelector((state) => state.music.songCurrent);
  const router = useRouter();
  const { getFavourite } = useFavourite();

  useEffect(() => {
    const {
      query: { musicTab },
    } = router;
    if (!musicTab) return;
    setTabActive(musicTab as any);
  }, []);

  useEffect(() => {
    getFavourite()
  }, [getFavourite]);


  const renderContent = useMemo(() => {
    switch (tabActive) {
      case 'charts':
        return (
          <Suspense fallback={<PanelLoading />}>
            <Charts />
          </Suspense>
        );
      case 'library':
        return <Library />;
      case 'search':
        return <div>Search</div>;
      default:
        return (
          <Suspense fallback={<PanelLoading />}>
            <Charts />
          </Suspense>
        );
    }
  }, [tabActive]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={rootRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: 'linear' }}
          exit={{ opacity: 0 }}
          className={twMerge(
            'fixed mp3 z-[1001] w-full h-full left-0 top-0 bg-[#170f23]'
          )}>
          <div
            className={twMerge(
              'flex h-[calc(100%-90px)]',
              !songCurrent && 'h-full'
            )}>
            {/* Sidebar */}
            <Sidebar tabActive={tabActive} setTabActive={setTabActive} />
            {/* End Sidebar */}
            {/* Main */}
            <div className="flex-grow flex flex-col px-5 pt-5 pb-2.5 gap-5">
              {/* Header */}
              <Header />
              {/* End Header */}
              {renderContent}
            </div>
            {/* End Main */}
          </div>
          {songCurrent && <Footer />}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MP3;
