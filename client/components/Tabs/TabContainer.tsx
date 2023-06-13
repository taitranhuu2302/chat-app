import React from 'react';
import styles from '@/styles/layouts/tabs.module.scss';
import {motion} from 'framer-motion';

interface ITabContainer {
  children: React.ReactNode;
  title: string;
  headerActions?: React.ReactNode;
}

const TabContainer: React.FC<ITabContainer> = ({ children, title, headerActions }) => {
  
  return <>
    <motion.div
                className={`${styles.wrapper} bg-via-400 dark:bg-via-200`}>
      <div className={`${styles.tabHeader}`}>
        <h4 className={`${styles.tabTitle}`}>{title}</h4>
        <div>
          {headerActions}
        </div>
      </div>
      <div className={`${styles.tabContent}`}>
        {children}
      </div>
    </motion.div>
  </>;
};

export default TabContainer;