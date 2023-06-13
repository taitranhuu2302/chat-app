import React from 'react';
import styles from '@/styles/layouts/main-layout.module.scss';
import Sidebar from '@/layouts/MainLayout/Sidebar';
import Tabs from './Tabs';
import ModalCalledVideo from '@/components/Modals/ModalCalledVideo';
import ModalCallVideo from '@/components/Modals/ModalCallVideo';

interface IMainLayout {
  children: React.ReactNode;
  isShowTab?: boolean;
}

const MainLayout: React.FC<IMainLayout> = ({ children, isShowTab = true }) => {
  return (
    <>
      <div className={styles.wrapper}>
        {/* Sidebar */}
        <Sidebar />
        {/* End Sidebar */}
        {/* Tab */}
        {isShowTab && <Tabs />}
        {/* End Tab */}
        {children}
        <ModalCallVideo />
        <ModalCalledVideo />
      </div>
    </>
  );
};

export default MainLayout;
