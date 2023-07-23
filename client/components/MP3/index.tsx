import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
  Suspense,
  lazy,
} from 'react';
import Sidebar from './Sidebar';
import { useAppSelector } from '@/redux/hooks';
import { twMerge } from 'tailwind-merge';
import Header from './Header';
// import Charts from './Charts';
import Footer from '@/components/MP3/Footer';
import Library from '@/components/MP3/Library';
import { AnimatePresence, motion } from 'framer-motion';
import PanelLoading from '@/components/MP3/PanelLoading';

const Charts = lazy(() => import('./Charts'));

const MP3 = () => {
  const { open } = useAppSelector((state) => state.music);
  const [tabActive, setTabActive] = useState<SidebarMP3>('charts');
  const rootRef = useRef<HTMLDivElement | null>(null);

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
          <div className={'flex h-[calc(100%-90px)]'}>
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
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MP3;
