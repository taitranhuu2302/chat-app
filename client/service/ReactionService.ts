import { useMutation } from 'react-query';
import { API } from '@/constants/Api';
import axiosConfig from '@/config/AxiosConfig';

export const useReactMessageApi = () => {
  return useMutation([API.REACTIONS.UPSERT], (data: ReactionCreateType): Promise<ResponseSuccess<ReactionType>> =>
    axiosConfig.post(API.REACTIONS.UPSERT, data)
  );
};
