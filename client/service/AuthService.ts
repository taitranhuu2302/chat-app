import { TOKEN_KEY } from '@/constants/Auth';
import { TokenResponse } from '@react-oauth/google';
import { useMutation, useQuery } from 'react-query';
import axiosConfig from '../config/AxiosConfig';
import { API } from '@/constants/Api';
import {UseQueryOptions} from "react-query/types/react/types";

export const getToken = () => ({
  accessToken: localStorage.getItem(TOKEN_KEY) || '',
});

export const setToken = ({ accessToken }: { accessToken: string }) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
};
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const useLoginGoogleApi = () => {
  return useMutation(
    [API.AUTH.GOOGLE_LOGIN],
    (tokens: TokenResponse): Promise<ResponseSuccess<TokenType>> =>
      axiosConfig.post(API.AUTH.GOOGLE_LOGIN, { tokens })
  );
};

export const useRegisterApi = () => {
  return useMutation(
    [API.AUTH.REGISTER],
    (data: RegisterType): Promise<ResponseSuccess<TokenType>> =>
      axiosConfig.post(API.AUTH.REGISTER, data)
  );
};

export const useLoginApi = () => {
  return useMutation(
    [API.AUTH.LOGIN],
    (data: LoginType): Promise<ResponseSuccess<TokenType>> =>
      axiosConfig.post(API.AUTH.LOGIN, data)
  );
};

export const useGetMeApi = (options?: any) => {
  return useQuery(
    [API.AUTH.GET_ME],
    (): Promise<ResponseSuccess<UserType>> => axiosConfig.get(API.AUTH.GET_ME),
    options
  );
};
