import axios from 'axios';
import { getToken } from '@/service/AuthService';
import { camelizeKeys } from 'humps';

const instance = axios.create({
  baseURL: process.env.API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

instance.interceptors.request.use(
  async (config: any) => {
    const { accessToken } = getToken();

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      response.headers['content-type'] === 'application/json'
    ) {
      response.data = camelizeKeys(response.data);
    }
    return response.data ? response.data : response;
  },
  async (error) => {
    if (!error.response) return Promise.reject(error);

    if (error.response.statusCode === 401) {
      window.location.href = '/auth';
      return Promise.reject(error.response.data);
    }

    return Promise.reject(error.response.data);
  }
);

export default instance;
