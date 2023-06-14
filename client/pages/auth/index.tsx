import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslate from '@/hooks/useTranslate';
import withPageLoading from '../../HOC/withPageLoading';
import LoginSocial from '@/components/LoginSocial';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

interface ILoginPage {}

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(/^(?!.*@[^,]*,)/, 'Email is not in the correct format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be longer than 6 characters')
    .required('Password is required'),
});

const LoginPage: React.FC<ILoginPage> = () => {
  const router = useRouter();
  const t: any = useTranslate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: yupResolver<any>(schema),
  });
  const onSubmit: SubmitHandler<LoginType> = (data) => {
    console.log(data);
  };

  return (
    <div className={'bg-via-500 dark:bg-via-300 w-full h-screen'}>
      <div className={'w-ful h-full flex-center flex-col'}>
        <div className={'flex items-end gap-2.5'}>
          <Image src={'/logo.svg'} alt={'Logo'} width={30} height={30} />
          <p className={'font-semibold text-xl'}>Chat app</p>
        </div>
        <p className={'mt-10 text-lg font-semibold'}>{t.auth.signIn.label}</p>
        <p className={'text-sm mt-1'}>{t.auth.signIn.description}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={'bg-white dark:bg-via-200 w-[450px] mt-5 rounded-md p-5'}>
          <div className={'flex flex-col'}>
            <label htmlFor="Email" className={'text-sm ml-[1px]'}>
              {t.auth.email.label}
            </label>
            <input
              id="Email"
              type="text"
              {...register('email')}
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
              {...register('password')}
              className={
                'border dark:border-night-400 bg-transparent rounded-md mt-1 py-2 text-sm px-2.5 outline-none'
              }
              placeholder={'***********'}
            />
          </div>
          <label className="label cursor-pointer justify-start gap-2.5 mt-2.5">
            <input
              type="checkbox"
              className="checkbox checkbox-primary checkbox-sm"
            />
            <span className="label-text dark:text-night-1100">
              {t.auth.rememberMe}
            </span>
          </label>
          <ul>
            {errors.email && (
              <li className={'text-red-500 text-[15px]'}>
                {errors.email.message}
              </li>
            )}
            {errors.password && (
              <li className={'text-red-500 text-[15px]'}>
                {errors.password.message}
              </li>
            )}
          </ul>
          <button
            type={'submit'}
            className={'bg-primary text-light w-full py-2 rounded-md mt-5'}>
            {t.auth.signIn.label}
          </button>
          <LoginSocial />
          <p className={'text-sm mt-10 text-center'}>
            {t.auth.signIn.subDescription}{' '}
            <Link href={'/auth/register'} className={'text-primary'}>
              {t.auth.signUp.label}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default withPageLoading(LoginPage);
