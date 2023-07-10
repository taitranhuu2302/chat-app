import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { API } from '@/constants/Api';
import axiosConfig from '@/config/AxiosConfig';

export const useGetConversationByUser = ({ options }: { options?: any }) => {
  return useInfiniteQuery(
    [API.CONVERSATION.FIND_ALL_BY_USER],
    () => axiosConfig.get(API.CONVERSATION.FIND_ALL_BY_USER),
    {
      getNextPageParam: ({ data }) => data.meta.nextPage,
      ...options,
    }
  );
};

export const useCreateConversation = ({ options }: { options?: any }) => {
  return useMutation(
    [API.CONVERSATION.CREATE],
    (data: ConversationCreate) =>
      axiosConfig.post(API.CONVERSATION.CREATE, data),
    options
  );
};

export const useGetConversationById = ({
  conversationId,
  options,
}: {
  conversationId: any;
  options?: any;
}) => {
  return useQuery(
    [API.CONVERSATION.FIND_BY_ID, conversationId],
    () => axiosConfig.get(`${API.CONVERSATION.FIND_BY_ID}/${conversationId}`),
    {
      enabled: !!conversationId,
      ...options,
    }
  );
};

export const useUpdateConversationApi = ({options}: {options?: any}) => {
  return useMutation(
    [API.CONVERSATION.UPDATE],
    ({id, data}: {id: string, data: ConversationUpdate}) => axiosConfig.put(`${API.CONVERSATION.UPDATE}/${id}`, data),
    {
      ...options
    }
  )
}

export const useUpdateConversationAvatarApi = () => {
  return useMutation(
    [API.CONVERSATION.CHANGE_AVATAR],
    ({id, data}: {id: string, data: any}) => axiosConfig.post(`${API.CONVERSATION.CHANGE_AVATAR}/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  )
}