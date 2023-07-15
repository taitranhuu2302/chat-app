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
import { useCreateConversation, useGetAllFileByConversation, useUpdateConversationAvatarApi } from '@/service/ConversationService';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';
import Avatar from 'react-avatar';
import { BsFillFileTextFill, BsThreeDots } from 'react-icons/bs';
import AddNewMember from './Dialog/AddNewMember';
import { useRouter } from 'next/router';
import { getFileType } from '@/utils/FileUtils';
import Fancybox from "@/components/Fancybox";
import VideoPlayer from './VideoPlayer';

interface ISidebarProfile {
  onClose: () => void;
  conversation: ConversationType
}

const SidebarProfile: React.FC<ISidebarProfile> = ({ onClose, conversation }) => {
  const { auth } = useContext(AuthContext) as AuthContextType;
  const [isEditChatName, setIsEditChatName] = useState(false)
  const [isAddNewMember, setIsAddNewMember] = useState(false)
  const t: any = useTranslate()
  const dispatch = useAppDispatch()
  const [media, setMedia] = useState<MessageType[]>([])
  const [docs, setDocs] = useState<MessageType[]>([])
  const { mutateAsync: changeRoomAvatar, isLoading: isLoadingChangeRoomAvatar } = useUpdateConversationAvatarApi()
  useGetAllFileByConversation({
    conversationId: conversation._id,
    options: {
      onSuccess: ({ data }: { data: MessageType[] }) => {
        setMedia([])
        setDocs([])
        data.forEach((item: MessageType) => {
          if (getFileType(item.file) === 'image' || getFileType(item.file) === 'video') {
            setMedia(m => [...m, item])
          }

          if (getFileType(item.file) === 'docs') {
            setDocs(d => [...d, item])
          }
        })
      }
    }
  });
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
        className={'max-w-[380px] w-full overflow-y-auto absolute right-0 bg-white dark:bg-via-300 h-full border-l border-light-400 dark:border-night-400 p-5'}>
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
                        <MemberItem key={`profile-${conversation._id}-${m._id}`} member={m} callback={onClose} />
                      ))
                    }
                    <li onClick={() => setIsAddNewMember(true)} className={`${styles.item} cursor-pointer dark:hover:bg-slate-500`}>
                      <a className='flex items-center gap-2.5'>
                        <IoAddCircleOutline size={25} />
                        <span>{t.addNewMember}</span>
                      </a>
                    </li>
                  </ul>
                </Collapse>
              </>
            )
          }
          <Collapse title={t.fileImage} className='border mb-5 rounded dark:border-night-400'>
            <Fancybox>
              <ul className='grid grid-cols-2 gap-2.5'>
                {
                  media.map((m) => {
                    if (getFileType(m.file) === 'video') {
                      return (
                        <li key={`sidebar-${m._id}`}>
                          <VideoPlayer src={m.file} />
                        </li>
                      )
                    }
                    return (
                      <li key={`sidebar-${m._id}`}>
                        <picture className='h-[100px] rounded cursor-pointer'>
                          <img src={m.file} alt="" data-fancybox={`sidebar-${m.conversation}`} className='h-full object-cover rounded' />
                        </picture>
                      </li>
                    )
                  })
                }
              </ul>
            </Fancybox>
          </Collapse>
          <Collapse title={t.attachedFile} className='border mb-5 rounded dark:border-night-400'>
            <ul>
              {
                docs.map((item) => {
                  const fileSplit = item.file.split('/');
                  const fileName = fileSplit[fileSplit.length - 1];
                  return (
                    <li
                      key={`sidebar-${item._id}`}
                      onClick={() => {
                        window.open(item.file, '_blank');
                      }}
                      className={
                        'gap-2.5 flex cursor-pointer dark:bg-gray-500 items-center rounded w-full bg-gray-300 p-3 overflow-hidden relative'
                      }>
                      <div>
                        <BsFillFileTextFill size={30} />
                      </div>
                      <p className={'line-clamp-2'}>
                        {fileName}
                      </p>
                    </li>
                  )
                })
              }
            </ul>
          </Collapse>
        </div>
      </motion.div>
    </div>
    <UpdateRoomName conversation={conversation} open={isEditChatName} onClose={() => setIsEditChatName(false)} />
    <AddNewMember open={isAddNewMember} conversation={conversation} onClose={() => setIsAddNewMember(false)} />
  </>;
};

interface IMemberItem {
  member: UserType;
  callback?: () => void;
}

const MemberItem: React.FC<IMemberItem> = ({ member, callback }) => {
  const { mutateAsync: createConversation, isLoading: isLoadingCreate } = useCreateConversation({});
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(onPageLoading(isLoadingCreate));
  }, [isLoadingCreate]);

  const handleCreate = async (friendId: string) => {
    try {
      const { data } = await createConversation({
        members: [friendId],
        conversationType: 'PRIVATE',
      });
      callback && callback()
      await router.push({
        pathname: `/rooms/[id]`,
        query: {
          ...router.query,
          id: data._id,
        },
      });
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return (
    <li className={`${styles.item} dark:hover:bg-slate-500`}>
      <div className='flex gap-2.5 items-center'>
        <Avatar src={member.avatar || ""} className='rounded' name={`${member.firstName} ${member.lastName}`} size={'40px'} />
        <span>{member.firstName} {member.lastName}</span>
      </div>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="cursor-pointer">
          <BsThreeDots />
        </label>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li onClick={() => handleCreate(member._id)}><a>Chat</a></li>
          <li><a>Remove</a></li>
        </ul>
      </div>
    </li>
  )
}

export default SidebarProfile;