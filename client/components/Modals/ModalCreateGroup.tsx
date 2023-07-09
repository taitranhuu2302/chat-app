import React, { useContext, useEffect, useRef, useState } from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import Divider from '@/components/Divider';
import Select, { StylesConfig } from 'react-select';
import { DarkModeContext } from '../../contexts/DarkModeProvider';
import useTranslate from '@/hooks/useTranslate';
import { useGetFriendByUser } from '@/service/UserService';
import { AuthContext, AuthContextType } from 'contexts/AuthContext';
import { flatMapObjectInfinite } from '@/utils/ArrayUtils';
import { toast } from 'react-hot-toast';
import { useCreateConversation } from '@/service/ConversationService';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';

interface IModalCreateGroup {

}

const colorStyles: StylesConfig = {
  control: (styles) => ({ ...styles, backgroundColor: '#36404A' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: '#36404A',
      ':active': {
        ...styles[':active'],
        backgroundColor: '#303841'
      }
    }
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: '#303841',
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: 'white',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: 'white',
    ':hover': {
      backgroundColor: '#303841',
      color: 'white',
    },
  }),
}


const ModalCreateGroup: React.FC<IModalCreateGroup> = () => {
  const { theme } = useContext(DarkModeContext)
  const t = useTranslate();
  const { auth } = useContext(AuthContext) as AuthContextType;
  const [friends, setFriends] = useState<UserType[]>([])
  const [members, setMembers] = useState<string[]>([])
  const [groupName, setGroupName] = useState<string>("")
  const selectInputRef = useRef<any>(null);
  const [totalFriends, setTotalFriends] = useState(10)
  const { data: friendData, refetch } = useGetFriendByUser({
    options: {
      onSuccess: (data: any) => {
        setFriends(flatMapObjectInfinite(data).map((item: any) => item.friend))
      }
    },
    id: auth?._id,
    limit: totalFriends
  })
  const { mutateAsync: createConversation, isLoading: createLoading } = useCreateConversation({ options: {} })
  const queryClient = useQueryClient()
  const [isGetFriends, setIsGetFriends] = useState(false)

  useEffect(() => {
    if (!isGetFriends) {
      const total = friendData?.pages[0].data.meta.total;
      setTotalFriends(total)
      refetch()
      setIsGetFriends(true)
    }
  }, [friendData])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!groupName || !members.length) {
      toast.error('Please enter all fields');
      return;
    }

    const payload: ConversationCreate = {
      conversationType: 'GROUP',
      members: members.map((item: any) => item.value),
      conversationName: groupName,
    };

    try {
      await createConversation(payload)
      await queryClient.refetchQueries([API.CONVERSATION.FIND_ALL_BY_USER])
      toast.success("Create group successfully")
      setGroupName("")
      setMembers([])
    } catch (e: any) {
      const errors = getErrorResponse(e.message)
      toast.error(errors[0])
    }
  }

  const onChangeSelect = (selectOptions: any) => {
    setMembers([...selectOptions])
  }

  return <>
    <div>
      <label data-tip={"Create Group"} htmlFor='modal-create-group' className={'tooltip cursor-pointer tooltip-left'}>
        <AiOutlineUsergroupAdd size={25} />
      </label>
      <input type='checkbox' id='modal-create-group' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box dark:bg-via-100 max-h-[500px] overflow-visible'>
          <div className={'flex justify-between items-center'}>
            <h4 className={'text-lg font-semibold'}>{t.home.tab.group.createGroup.title}</h4>
            <label htmlFor='modal-create-group' className={'cursor-pointer'}>
              <IoClose size={20} />
            </label>
          </div>
          <Divider />
          <form className={'flex flex-col gap-2.5 h-full'} onSubmit={handleSubmit}>
            <div className={'flex flex-col gap-2.5'}>
              <label htmlFor='group-name' className={'text-md'}>{t.home.tab.group.createGroup.groupName.label}</label>
              <input value={groupName} onChange={(e) => setGroupName(e.target.value)} type='text' id={'group-name'} placeholder={t.home.tab.group.createGroup.groupName.hint} className={'outline-none border dark:bg-via-300 py-1.5 px-2.5 rounded'} />
            </div>
            <div className={'flex flex-col gap-2.5'}>
              <label htmlFor='group-members' className={'text-md'}>{t.home.tab.group.createGroup.groupMember.label}</label>
              <Select
                isMulti
                id={'group-members'}
                options={friends.map((friend) => ({ label: `${friend.firstName} ${friend.lastName}`, value: friend._id }))}
                className={'select-custom'}
                value={members}
                placeholder={t.home.tab.group.createGroup.groupMember.hint}
                classNamePrefix="select"
                onChange={onChangeSelect}
                styles={theme === 'dark' ? colorStyles : {}}
                ref={selectInputRef}
              />
              {/*<div className={'flex flex-col gap-2.5'}>*/}
              {/*  <label htmlFor='group-description' className={'text-md'}>{t.home.tab.group.createGroup.groupDesc.label}</label>*/}
              {/*  <textarea placeholder={t.home.tab.group.createGroup.groupDesc.hint} className={'outline-none border dark:bg-via-300 py-1.5 px-2.5 rounded'}></textarea>*/}
              {/*</div>*/}
            </div>

            <div className='modal-action flex-grow'>
              <label htmlFor='modal-create-group' className='btn btn-sm btn-error'>{t.home.tab.group.createGroup.closeText}</label>
              <button disabled={createLoading} className='btn btn-sm btn-primary'>
                {
                  createLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <span>{t.home.tab.group.createGroup.submitText}</span>
                  )
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;
};

export default ModalCreateGroup;