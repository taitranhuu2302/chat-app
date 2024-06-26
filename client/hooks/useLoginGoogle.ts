import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { setToken, useLoginGoogleApi } from '@/service/AuthService';
import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';

export const useLoginGoogle = () => {
  const { mutateAsync, isLoading } = useLoginGoogleApi();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    dispatch(onPageLoading(isLoading));
  }, [isLoading]);

  const handleLoginGoogle = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (codeResponse) => {
      const { data } = await mutateAsync(codeResponse);
      setToken({ accessToken: data.accessToken });
      await queryClient.refetchQueries([API.AUTH.GET_ME]);
      await router.replace('/');
      toast.success('Login success');
    },
    onError: (errorResponse) => {
      console.error(errorResponse);
    },
  });

  return { handleLoginGoogle, isLoading };
};
