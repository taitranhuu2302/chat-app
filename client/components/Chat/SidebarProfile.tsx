import React, { useContext, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import AvatarCustom from '@/components/AvatarCustom';
import Divider from '@/components/Divider';
import UserInfo from '../UserInfo';
import { motion } from 'framer-motion';
import { AuthContext, AuthContextType } from 'contexts/AuthContext';
import Collapse from '../Collapse';
import useTranslate from '@/hooks/useTranslate';
import styles from '@/styles/components/chat.module.scss'
import { AiFillEdit } from 'react-icons/ai';
import { BiImageAdd } from 'react-icons/bi';
import { IoAddCircleOutline } from 'react-icons/io5';
import UpdateRoomName from './Dialog/UpdateRoomName';
import { toast } from 'react-hot-toast';
import { useUpdateConversationAvatarApi } from '@/service/ConversationService';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';
import Avatar from 'react-avatar';


interface ISidebarProfile {
  onClose: () => void;
  conversation: ConversationType
}

const SidebarProfile: React.FC<ISidebarProfile> = ({ onClose, conversation }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const [isEditChatName, setIsEditChatName] = useState(false)
  const t: any = useTranslate()
  const dispatch = useAppDispatch()
  const { mutateAsync: changeRoomAvatar, isLoading: isLoadingChangeRoomAvatar } = useUpdateConversationAvatarApi()
  const queryClient = useQueryClient()

  const handleClose = (e: any) => {
    if (e.target.getAttribute('data-type')) {
      onClose()
    }
  }

  useEffect(() => {
    dispatch(onPageLoading(isLoadingChangeRoomAvatar))
  }, [isLoadingChangeRoomAvatar])

  const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (!file) {
      toast.error("Please choose a photo")
      return
    };
    try {
      const formData = new FormData()
      formData.append("avatar", file);
      await changeRoomAvatar({
        id: conversation._id,
        data: formData
      })
      await queryClient.refetchQueries([API.CONVERSATION.FIND_ALL_BY_USER])
      await queryClient.refetchQueries([API.CONVERSATION.FIND_BY_ID])
      toast.success("Change room avatar success")
    } catch (e: any) {
      const errors = getErrorResponse(e.message)
      toast.error(errors[0])
    }
  }

  return <>
    <div onClick={handleClose} data-type="overlay" className='fixed z-[100] w-full h-full top-0 left-0' style={{
      background: 'rgba(0,0,0,0.5)'
    }}>
      <motion.div initial={{ x: '100%' }}
        animate={{ x: '0' }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.4 }}
        className={'max-w-[380px] w-full absolute right-0 bg-white dark:bg-via-300 h-full border-l border-light-400 dark:border-night-400 p-5'}>
        <div className={'flex justify-end'}>
          <button onClick={onClose}>
            <IoClose size={20} />
          </button>
        </div>
        <div>
          <AvatarCustom src={conversation.avatar || ""} name={conversation.conversationName} />
          <Divider />
          {
            conversation.conversationType === "PRIVATE" ? (
              <UserInfo user={conversation.members.find((item) => item._id !== auth?._id)} />
            ) : (
              <>
                <Collapse title={t.roomInformation} className='border mb-5 rounded dark:border-night-400'>
                  <ul>
                    <li onClick={() => setIsEditChatName(true)} className={`${styles.item} dark:hover:bg-slate-500 cursor-pointer`}>
                      <AiFillEdit size={22} />
                      <span>{t.changeChatName}</span>
                    </li>
                    <label htmlFor='room-avatar' className={`${styles.item} dark:hover:bg-slate-500 cursor-pointer`}>
                      <BiImageAdd size={25} />
                      <span>{t.changeChatAvatar}</span>
                      <input hidden type="file" id="room-avatar" onChange={handleChangeAvatar} />
                    </label>
                  </ul>
                </Collapse>
                <Collapse title={t.membersOfRoom} className='border mb-5 rounded dark:border-night-400'>
                  <ul>
                    {
                      conversation.members.map((m) => (
                        <li key={`profile-${conversation._id}-${m._id}`} className={`${styles.item} dark:hover:bg-slate-500`}>
                          <Avatar src={m.avatar || ""} name={`${m.firstName} ${m.lastName}`} size={'40px'}/>
                          <span>{m.firstName} {m.lastName}</span>
                        </li>
                      ))
                    }
                    <li className={`${styles.item} cursor-pointer dark:hover:bg-slate-500`}>
                      <IoAddCircleOutline size={25} />
                      <span>{t.addNewMember}</span>
                    </li>
                  </ul>
                </Collapse>
              </>
            )
          }
          <Collapse title={t.fileImage} className='border mb-5 rounded dark:border-night-400'>
            <ul>
              <li>asd</li>
            </ul>
          </Collapse>
          <Collapse title={t.attachedFile} className='border mb-5 rounded dark:border-night-400'>
            <ul>
              <li>asd</li>
            </ul>
          </Collapse>
        </div>
      </motion.div>
    </div>
    <UpdateRoomName conversation={conversation} open={isEditChatName} onClose={() => setIsEditChatName(false)} />
  </>;
};

export default SidebarProfile;