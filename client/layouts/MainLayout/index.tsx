import React from 'react';
import styles from '@/styles/layouts/main-layout.module.scss';
import Sidebar from '@/layouts/MainLayout/Sidebar';
import Tabs from './Tabs';

interface IMainLayout {
  children: React.ReactNode;
}

const MainLayout: React.FC<IMainLayout> = ({ children }) => {
  
  return <>
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <Sidebar />
      {/* End Sidebar */}
      {/* Tab */}
      <Tabs />
      {/* End Tab */}
      {children}
    </div>
  </>;
};

export default MainLayout;