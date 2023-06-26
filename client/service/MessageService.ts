import { useInfiniteQuery, useMutation } from 'react-query';
import { API } from '@/constants/Api';
import axiosConfig from '@/config/AxiosConfig';

export const useSendMessageApi = (options?: any) => {
  return useMutation(
    [API.MESSAGE.CREATE],
    (data: any) =>
      axiosConfig.post(API.MESSAGE.CREATE, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    options
  );
};

export const useGetMessageByConversationApi = ({
  options,
  conversationId,
}: {
  options?: any;
  conversationId: string | string[] | undefined;
}) => {
  return useInfiniteQuery(
    [API.MESSAGE.FIND_ALL_BY_CONVERSATION, conversationId],
    ({ pageParam }) =>
      axiosConfig.get(
        `${API.MESSAGE.FIND_ALL_BY_CONVERSATION}/${conversationId}?page=${pageParam}`
      ),
    {
      ...options,
      enabled: !!conversationId,
    }
  );
};
