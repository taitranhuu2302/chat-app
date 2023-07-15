import Modal from '@/components/Modals'
import useTranslate from '@/hooks/useTranslate';
import { useGetFriendByUser } from '@/service/UserService';
import { flatMapObjectInfinite } from '@/utils/ArrayUtils';
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext, AuthContextType } from 'contexts/AuthContext';
import Select, { StylesConfig } from 'react-select';
import { DarkModeContext } from 'contexts/DarkModeProvider';
import { useAddMemberToConversation } from '@/service/ConversationService';
import toast from 'react-hot-toast';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';

interface IProps {
  open: boolean;
  onClose: () => void;
  conversation: ConversationType
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


const AddNewMember: React.FC<IProps> = ({ open, onClose, conversation }) => {
  const t = useTranslate()
  const [totalFriends, setTotalFriends] = useState(10)
  const [friends, setFriends] = useState<UserType[]>([])
  const [isGetFriends, setIsGetFriends] = useState(false)
  const { auth } = useContext(AuthContext) as AuthContextType;
  const [members, setMembers] = useState<any[]>([])
  const { theme } = useContext(DarkModeContext)
  const { mutateAsync: addMemberAsync, isLoading: addMemberLoading } = useAddMemberToConversation()
  const queryClient =  useQueryClient()
  const { data: friendData, refetch } = useGetFriendByUser({
    options: {
      onSuccess: (data: any) => {
        setFriends(flatMapObjectInfinite(data).map((item: any) => item.friend))
      }
    },
    id: auth?._id,
    limit: totalFriends
  })

  useEffect(() => {
    if (!isGetFriends) {
      const total = friendData?.pages[0].data.meta.total;
      setTotalFriends(total)
      refetch()
      setIsGetFriends(true)
    }
  }, [friendData])

  const onChangeSelect = (selectOptions: any) => {
    setMembers([...selectOptions])
  }

  const handleSubmit = async (e: React.SyntheticEvent) =>{ 
    e.preventDefault()
    const payload: ConversationAddMember = {
      conversationId: conversation._id,
      members: members.map((item) => item.value)
    }

    try {
      await addMemberAsync(payload)
      toast.success("Add member success")
      await queryClient.refetchQueries([API.CONVERSATION.FIND_BY_ID])
    } catch (e: any) {
      const errors = getErrorResponse(e.message)
      toast.error(errors[0])
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={t.addNewMember} isButtonClose>
      <form className={'flex flex-col gap-2.5 h-full'} onSubmit={handleSubmit}>
        <div className={'flex flex-col gap-2.5'}>
          <label htmlFor='group-members' className={'text-md'}>{t.newMember}</label>
          <Select
            isMulti
            id={'group-members'}
            options={friends.map((friend) => ({ label: `${friend.firstName} ${friend.lastName}`, value: friend._id }))}
            className={'select-custom'}
            value={members}
            placeholder={t.newMember}
            classNamePrefix="select"
            onChange={onChangeSelect}
            styles={theme === 'dark' ? colorStyles : {}}
          />
        </div>

        <div className='modal-action flex-grow'>
          <button type='button' onClick={onClose} className='btn btn-md btn-error'>{t.home.tab.group.createGroup.closeText}</button>
          <button disabled={addMemberLoading} type='submit' className='btn btn-primary'>
            {
              addMemberLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span>{t.saveChanges}</span>
              )
            }
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddNewMember