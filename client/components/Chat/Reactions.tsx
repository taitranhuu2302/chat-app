import React, {PropsWithChildren, useRef, useState} from 'react';
import { HiOutlineEmojiHappy } from 'react-icons/hi';
import { ReactionEnum, reactionIcons } from '@/constants/Chat';
import { motion } from 'framer-motion';
import {useOnClickOutside} from "usehooks-ts";
import { useReactMessageApi } from '@/service/ReactionService';
import { getErrorResponse } from '@/utils/ErrorUtils';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

interface IProps {
  message: MessageType;
  onCallback: (data: any) => void;
  isOwner?: boolean;
}

const Reactions: React.FC<PropsWithChildren<IProps>> = ({ message, onCallback, isOwner }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null)
  let timerId: NodeJS.Timeout | null = null;
  const {mutateAsync: reactionMessage} = useReactMessageApi()
  
  useOnClickOutside(ref, () => {
    setIsOpen(false)
  })

  const handleReactions = async (name: ReactionEnum) => {
    try {
      const {data} = await reactionMessage({
        messageId: message._id,
        reactionType: name
      })
      onCallback(data)
    } catch (e: any) {
      const errors = getErrorResponse(e.message);
      toast.error(errors[0]);
    } finally {
      setIsOpen(false)
    }
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
      <div className={'relative flex items-center '} ref={ref} onMouseOver={onHover} onMouseLeave={onLeave}>
        <button onClick={() => setIsOpen((o) => !o)}>
          <HiOutlineEmojiHappy size={18} className={'text-primary'} />
        </button>
        {isOpen && (
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={twMerge('absolute bottom-full z-[100] flex items-center py-2 px-3 flex-nowrap menu menu-horizontal bg-white shadow-md rounded-box mt-6 w-fit', isOwner ? 'right-0' : 'left-0')}>
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
