import React, {PropsWithChildren, useRef, useState} from 'react';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { ReactionEnum, reactionIcons } from '@/constants/Chat';
import { motion } from 'framer-motion';
import {useOnClickOutside} from "usehooks-ts";

interface IProps {
  message: MessageType;
}

const Reactions: React.FC<PropsWithChildren<IProps>> = ({ message }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null)
  let timerId: NodeJS.Timeout | null = null;
  
  useOnClickOutside(ref, () => {
    setIsOpen(false)
  })

  const handleReactions = (name: ReactionEnum) => {
    console.log(name);
  };
  
  const onHover = () => {
    if (!timerId) return;
    clearTimeout(timerId)
  }
  
  const onLeave = () => {
    timerId = setTimeout(() => {
      setIsOpen(false)
    }, 500)
  }

  return (
    <>
      <div className={'relative flex items-center'} ref={ref} onMouseOver={onHover} onMouseLeave={onLeave}>
        <button onClick={() => setIsOpen((o) => !o)}>
          <HiOutlineEmojiHappy size={18} className={'text-primary'} />
        </button>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full right-0 flex items-center py-2 px-3 flex-nowrap menu menu-horizontal bg-base shadow-md rounded-box mt-6">
            {reactionIcons.map((item, index) => {
              return (
                <li
                  key={`${message._id}-${index}`}
                  onClick={() => handleReactions(item.name)}>
                  <picture className={'p-1'}>
                    <img src={item.icon} alt={item.name} />
                  </picture>
                </li>
              );
            })}
          </motion.ul>
        )}
      </div>
    </>
  );
};

export default Reactions;
