import React, { useContext } from 'react';
import { IoClose } from 'react-icons/io5';
import AvatarCustom from '@/components/AvatarCustom';
import Divider from '@/components/Divider';
import UserInfo from '../UserInfo';
import { motion } from 'framer-motion';
import { AuthContext, AuthContextType } from 'contexts/AuthContext';

interface ISidebarProfile {
  onClose: () => void;
}

const SidebarProfile: React.FC<ISidebarProfile> = ({ onClose }) => {
  const {auth} = useContext(AuthContext) as AuthContextType;
  return <>
    <motion.div initial={{ x: '100%' }}
      animate={{ x: '0' }}
      exit={{ x: '100%' }}
      transition={{ duration: 0.4 }}
      className={'max-w-[380px] w-full fixed right-0 bg-white dark:bg-via-300 h-full border-l border-light-400 dark:border-night-400 p-5'}>
      <div className={'flex justify-end'}>
        <button onClick={onClose}>
          <IoClose size={20} />
        </button>
      </div>
      <div>
        <AvatarCustom />
        <Divider />
        <UserInfo user={auth}/>
      </div>
    </motion.div>
  </>;
};

export default SidebarProfile;