import { useGoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { setToken, useLoginGoogleApi } from '../service/AuthService';
import { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { onPageLoading } from '../redux/features/PageLoadingSlice';
import { useRouter } from 'next/router';

export const useLoginGoogle = () => {
  const { mutateAsync, isLoading } = useLoginGoogleApi();
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(onPageLoading(isLoading));
  }, [isLoading]);

  const handleLoginGoogle = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (codeResponse) => {
      const { data } = await mutateAsync(codeResponse);
      setToken({ accessToken: data.accessToken });
      await router.replace('/');
      toast.success('Login success');
    },
    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

  return { handleLoginGoogle, isLoading };
};
