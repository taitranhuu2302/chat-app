import { TOKEN_KEY } from '../constants/Auth';
import { TokenResponse } from '@react-oauth/google';
import { useMutation } from 'react-query';
import axiosConfig from '../config/AxiosConfig';
import { API } from '../constants/Api';

export const getToken = () => ({
  accessToken: localStorage.getItem(TOKEN_KEY) || '',
});

export const setToken = ({ accessToken }: { accessToken: string }) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
};

export const useLoginGoogleApi = () => {
  return useMutation(
    [API.AUTH.GOOGLE_LOGIN],
    (tokens: TokenResponse): Promise<ResponseSuccess<TokenType>> =>
      axiosConfig.post(API.AUTH.GOOGLE_LOGIN, { tokens })
  );
};