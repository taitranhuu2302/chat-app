import React from 'react';
import { IoClose } from 'react-icons/io5';
import AvatarCustom from '@/components/AvatarCustom';
import Divider from '@/components/Divider';
import UserInfo from '../UserInfo';
import { motion } from 'framer-motion';

interface ISidebarProfile {
  onClose: () => void;
}

const SidebarProfile: React.FC<ISidebarProfile> = ({ onClose }) => {
  
  return <>
    <motion.div initial={{ x: '100%' }}
                animate={{ x: '0' }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.4 }}
                className={'w-[380px] h-full border-l border-light-400 dark:border-night-400 p-5'}>
      <div className={'flex justify-end'}>
        <button onClick={onClose}>
          <IoClose size={20} />
        </button>
      </div>
      <div>
        <AvatarCustom />
        <Divider />
        <UserInfo />
      </div>
    </motion.div>
  </>;
};

export default SidebarProfile;