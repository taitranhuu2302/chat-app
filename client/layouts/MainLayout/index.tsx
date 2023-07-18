import ModalSearchUser from '@/components/Modals/ModalSearchUser';
import Sidebar from '@/layouts/MainLayout/Sidebar';
import styles from '@/styles/layouts/main-layout.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import Tabs from './Tabs';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { useAppDispatch } from '@/redux/hooks';
import { onOpenMusic } from '@/redux/features/MusicSlice';

const ModalCalledVideoDynamic = dynamic(() => import("@/components/Modals/ModalCalledVideo"), { ssr: false })
const ModalCallVideo = dynamic(() => import('@/components/Modals/ModalCallVideo'), { ssr: false })
const MP3 = dynamic(() => import('@/components/MP3'), {ssr: false})

interface IMainLayout {
  children: React.ReactNode;
  isShowTab?: boolean;
}

const MainLayout: React.FC<IMainLayout> = ({ children, isShowTab = true }) => {
  const constraintsRef = useRef<any>(null);
  const dispatch = useAppDispatch()
  const [dragStart, setDragStart] = useState<number>(0);

  const onMouseDown = (event: any) => {
    setDragStart(new Date().getTime());
  };

  const onMouseUp = () => {
    if ((new Date().getTime() - dragStart) < 150) {
      dispatch(onOpenMusic(true))
    }
  }

  // useEffect(() => {

  //   if (typeof window === 'undefined') return;
    
  //   const drawRipple = (ev: any) => {
  //     var x = ev.clientX;
  //     var y = ev.clientY;
  //     var node: any = document.querySelector(".ripple");
  //     var newNode = node.cloneNode(true);
  //     newNode.classList.add("animate-ripple");
  //     newNode.style.left = ev.clientX - 5 + "px";
  //     newNode.style.top = ev.clientY - 5 + "px";
  //     node.parentNode.replaceChild(newNode, node);
  //   };

  //   window.addEventListener('click', drawRipple)

  //   return () => {
  //     window.removeEventListener('click', drawRipple)
  //   }

  // }, [])
  
  return (
    <>
      <motion.div className='w-full h-full' ref={constraintsRef}>
        <motion.div onMouseUp={onMouseUp} onMouseDown={onMouseDown} className='fixed z-[1000] opacity-40 hover:opacity-100 cursor-pointer' drag dragConstraints={constraintsRef}>
          <picture>
            <img className='pointer-events-none w-[60px] rounded-2xl' src="https://i02.appmifile.com/images/2018/01/25/2e1ac247-ef54-47c4-b899-9d5b01a933ab.png" alt="" />
          </picture>
        </motion.div>
        <div className={styles.wrapper}>
          {/* Sidebar */}
          <Sidebar />
          {/* End Sidebar */}
          {/* Tab */}
          {isShowTab && <Tabs />}
          {/* End Tab */}
          {children}
          <ModalCallVideo />
          <ModalCalledVideoDynamic />
          <ModalSearchUser />
          <div className='ripple'></div>
        </div>
        <MP3 />
      </motion.div>
    </>
  );
};

export default MainLayout;
