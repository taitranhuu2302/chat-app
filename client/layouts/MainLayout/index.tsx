import ModalSearchUser from '@/components/Modals/ModalSearchUser';
import Sidebar from '@/layouts/MainLayout/Sidebar';
import styles from '@/styles/layouts/main-layout.module.scss';
import React from 'react';
import Tabs from './Tabs';

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
        
        <ModalSearchUser />
      </div>
    </>
  );
};

export default MainLayout;
