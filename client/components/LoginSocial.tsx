import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import useTranslate from '@/hooks/useTranslate';
import { useLoginGoogle } from '@/hooks/useLoginGoogle';

interface IProps {}

const LoginSocial: React.FC<IProps> = () => {
  const t: any = useTranslate();
  const { handleLoginGoogle } = useLoginGoogle();

  return (
    <>
      <div className={'flex my-2.5 items-center justify-center gap-3'}>
        <div className={'flex-grow border-b'}></div>
        <p>{t.auth.or}</p>
        <div className={'flex-grow border-b'}></div>
      </div>
      <button
        type="button"
        onClick={() => handleLoginGoogle()}
        className={
          'w-full hover:bg-gray-100 dark:hover:bg-gray-600 py-2 border flex items-center justify-center gap-2.5 rounded-full'
        }>
        <FcGoogle size={25} />
        {t.auth.loginGoogle}
      </button>
    </>
  );
};

export default LoginSocial;
