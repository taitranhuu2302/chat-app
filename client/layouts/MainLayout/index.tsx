import ModalSearchUser from '@/components/Modals/ModalSearchUser';
import Sidebar from '@/layouts/MainLayout/Sidebar';
import styles from '@/styles/layouts/main-layout.module.scss';
import React, {useEffect} from 'react';
import Tabs from './Tabs';
import dynamic from 'next/dynamic';
import {useAppSelector} from "@/redux/hooks";

const ModalCalledVideoDynamic = dynamic(() => import("@/components/Modals/ModalCalledVideo"), {ssr: false})
const ModalCallVideo = dynamic(() => import('@/components/Modals/ModalCallVideo'), {ssr: false})
const MP3 = dynamic(() => import('@/components/MP3'), {ssr: false})

interface IMainLayout {
  children: React.ReactNode;
  isShowTab?: boolean;
}

const MainLayout: React.FC<IMainLayout> = ({children, isShowTab = true}) => {
  return (
    <>
      <div className="w-full h-full">
        <div className={styles.wrapper}>
          {/* Sidebar */}
          <Sidebar/>
          {/* End Sidebar */}
          {/* Tab */}
          {isShowTab && <Tabs/>}
          {/* End Tab */}
          {children}
          <ModalCallVideo/>
          <ModalCalledVideoDynamic/>
          <ModalSearchUser/>
        </div>
        <MP3/>
      </div>
    </>
  );
};

export default MainLayout;
