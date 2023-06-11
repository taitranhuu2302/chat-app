import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useTranslate from '@/hooks/useTranslate';
import LoginSocial from '@/components/LoginSocial';
import withPageLoading from '../../HOC/withPageLoading';

interface IRegister {}

const RegisterPage: React.FC<IRegister> = () => {
  const t = useTranslate();

  return (
    <div className={'bg-via-500 dark:bg-via-300 w-full h-screen'}>
      <div className={'w-ful h-full flex-center flex-col'}>
        <div className={'flex items-end gap-2.5'}>
          <Image src={'/logo.svg'} alt={'Logo'} width={30} height={30} />
          <p className={'font-semibold text-xl'}>Chat app</p>
        </div>
        <p className={'mt-10 text-lg font-semibold'}>{t.auth.signUp.label}</p>
        <p className={'text-sm mt-1'}>{t.auth.signUp.description}</p>
        <form
          className={'bg-white dark:bg-via-200 w-[450px] mt-5 rounded-md p-5'}>
          <div className={'flex flex-col'}>
            <label htmlFor="Email" className={'text-sm ml-[1px]'}>
              {t.auth.email.label}
            </label>
            <input
              id="Email"
              type="text"
              className={
                'border dark:border-night-400 bg-transparent rounded-md mt-1 py-2 text-sm px-2.5 outline-none'
              }
              placeholder={t.auth.email.hint}
            />
          </div>
          <div className={'flex flex-col mt-3'}>
            <label htmlFor="Password" className={'text-sm ml-[1px]'}>
              {t.auth.password.label}
            </label>
            <input
              id="Password"
              type="password"
              className={
                'border dark:border-night-400 bg-transparent rounded-md mt-1 py-2 text-sm px-2.5 outline-none'
              }
              placeholder={'**********'}
            />
          </div>
          <div className={'flex flex-col mt-3'}>
            <label htmlFor="ConfirmPassword" className={'text-sm ml-[1px]'}>
              {t.auth.confirmPassword.label}
            </label>
            <input
              id="ConfirmPassword"
              type="password"
              className={
                'border dark:border-night-400 bg-transparent rounded-md mt-1 py-2 text-sm px-2.5 outline-none'
              }
              placeholder={'**********'}
            />
          </div>
          <button
            className={'bg-primary text-light w-full py-2 rounded-md mt-5'}>
            {t.auth.signUp.label}
          </button>
          <LoginSocial />
          <p className={'text-sm mt-10 text-center'}>
            {t.auth.signUp.subDescription}{' '}
            <Link href={'/auth'} className={'text-primary'}>
              {t.auth.signIn.label}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default withPageLoading(RegisterPage);