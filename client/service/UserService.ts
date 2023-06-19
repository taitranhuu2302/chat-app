import { API } from '@/constants/Api';
import { useInfiniteQuery, useMutation, useQuery } from 'react-query';
import axiosConfig from '@/config/AxiosConfig';
import queryString from 'query-string';

export const useGetUserApi = ({ options, query }: any) => {
  return useInfiniteQuery(
    [API.USER.SEARCH, query],
    (): Promise<ResponseSuccess<Paginate<UserType>>> =>
      axiosConfig.get(`${API.USER.SEARCH}?${queryString.stringify(query)}`),
    {
      getNextPageParam: ({ data }) => data.meta.nextPage,
      ...options,
    }
  );
};

export const useSendRequestFriendApi = (options?: any) => {
  return useMutation(
    [API.USER.SEND_REQUEST_FRIEND],
    (data: RequestFriendType): Promise<any> =>
      axiosConfig.post(API.USER.SEND_REQUEST_FRIEND, data),
    options
  );
};

export const useCancelRequestFriendApi = (options?: any) => {
  return useMutation(
    [API.USER.CANCEL_REQUEST_FRIEND],
    (data: RequestFriendType): Promise<any> =>
      axiosConfig.post(API.USER.CANCEL_REQUEST_FRIEND, data),
    options
  );
};

export const useAcceptRequestFriendApi = (options?: any) => {
  return useMutation(
    [API.USER.ACCEPT_REQUEST_FRIEND],
    (data: RequestFriendType) =>
      axiosConfig.post(API.USER.ACCEPT_REQUEST_FRIEND, data),
    options
  );
};

export const useCancelFriendApi = (options?: any) => {
  return useMutation(
    [API.USER.UN_FRIEND],
    ({ friendId }: { friendId: string }) =>
      axiosConfig.post(API.USER.UN_FRIEND, { friendId }),
    options
  );
};

export const useRejectRequestFriendApi = (options?: any) => {
  return useMutation(
    [API.USER.REJECT_REQUEST_FRIEND],
    (data: RequestFriendType) =>
      axiosConfig.post(API.USER.REJECT_REQUEST_FRIEND, data),
    options
  );
};

export const useGetFriendByUser = ({ options, id }: any) => {
  return useInfiniteQuery(
    [API.USER.GET_FRIEND, id],
    ({ pageParam = 1 }) =>
      axiosConfig.get(`${API.USER.GET_FRIEND}/${id}?page=${pageParam}`),
    {
      enabled: !!id,
      getNextPageParam: ({ data }) => data.meta.nextPage,
      ...options,
    }
  );
};

export const useGetCountRequestFriendApi = (options: any) => {
  return useQuery(
    [API.USER.COUNT_REQUEST_FRIEND],
    () => axiosConfig.get(API.USER.COUNT_REQUEST_FRIEND),
    options
  );
};

export const useGetFriendRequestByUser = ({
  options,
  id,
}: {
  id?: string;
  options?: any;
}) => {
  return useInfiniteQuery(
    [API.USER.GET_REQUEST_FRIEND, id],
    ({ pageParam = 1 }) =>
      axiosConfig.get(`${API.USER.GET_REQUEST_FRIEND}/${id}?page=${pageParam}`),
    {
      enabled: !!id,
      getNextPageParam: ({ data }) => data.meta.nextPage,
      ...options,
    }
  );
};

export const useUpdateUserInformationApi = ({options}: {options?: any}) => {
  return useMutation([API.USER.UPDATE], (data: UserInformationType) => axiosConfig.put(API.USER.UPDATE, data), options)
}

export const useChangePasswordApi = ({options}: {options?: any}) => {
  return useMutation([API.USER.CHANGE_PASSWORD], (data: UserChangePasswordType) => axiosConfig.put(API.USER.CHANGE_PASSWORD, data), options)
}