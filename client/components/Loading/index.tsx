import React from 'react';
import styles from '@/styles/components/page-loading.module.scss';

interface IPageLoading {
  floating?: boolean;
}

const LoadingPage: React.FC<IPageLoading> = ({ floating = false }) => {
  return (
    <>
      {floating ? (
        <div
          className={`fixed top-0 left-0 w-full h-full flex-center ${styles['bg-opacity']} flex-col gap-5 z-[10000]`}>
          <div className={styles.loader} />
        </div>
      ) : (
        <div className="h-screen w-full flex-center flex-col gap-5 bg-via-500">
          <div className={styles.loader} />
        </div>
      )}
    </>
  );
};

export default LoadingPage;
