import Input from '@/components/Input';
import Modal from '@/components/Modals'
import { API } from '@/constants/Api';
import useTranslate from '@/hooks/useTranslate';
import { useUpdateConversationApi } from '@/service/ConversationService';
import { getErrorResponse } from '@/utils/ErrorUtils';
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';
import { useQueryClient } from 'react-query';

interface IProps {
  open: boolean;
  onClose: () => void;
  conversation: ConversationType
}

const UpdateRoomName: React.FC<IProps> = ({ open, onClose, conversation }) => {
  const t = useTranslate()
  const [chatName, setChatName] = useState(conversation.conversationName)
  const { mutateAsync, isLoading } = useUpdateConversationApi({})
  const queryClient = useQueryClient()

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    if (!chatName) return;

    try {
      await mutateAsync({
        id: conversation._id,
        data: { conversationName: chatName },
      })
      await queryClient.refetchQueries([API.CONVERSATION.FIND_ALL_BY_USER])
      await queryClient.refetchQueries([API.CONVERSATION.FIND_BY_ID])
      toast.success("Update conversation success")
      onClose()
    } catch (e: any) {
      const errors = getErrorResponse(e.message)
      toast.error(errors[0])
    }

  }

  return (
    <Modal open={open} onClose={onClose} title={t.changeChatName} isButtonClose>
      <form onSubmit={handleSubmit}>
        <Input
          className={`border outline-none rounded bg-transparent dark:border-night-500`}
          label={'Chat Name'}
          placeholder={'New name'}
          value={chatName}
          onChange={(value) => setChatName(value)}
        />
        <button type='submit' disabled={!chatName || isLoading} className="btn-custom">
          {isLoading ? <span className="loading loading-spinner loading-md"></span> : <span>{t.saveChanges}</span>}
        </button>
      </form>
    </Modal>
  )
}

export default UpdateRoomName