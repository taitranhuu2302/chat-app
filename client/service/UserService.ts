import { API } from '@/constants/Api';
import { useMutation, useQuery } from 'react-query';
import axiosConfig from '@/config/AxiosConfig';
import queryString from 'query-string';

export const useGetUserApi = ({ options, query }: any) => {
  return useQuery(
    [API.USER.SEARCH, query],
    (): Promise<ResponseSuccess<Paginate<UserType>>> =>
      axiosConfig.get(`${API.USER.SEARCH}?${queryString.stringify(query)}`),
    options
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
