import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import useTranslate from '@/hooks/useTranslate';
import LoginSocial from '@/components/LoginSocial';
import withPageLoading from '../../HOC/withPageLoading';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { setToken, useRegisterApi } from '@/service/AuthService';
import { useRouter } from 'next/router';
import IconLoading from '@/components/Loading/IconLoading';
import { getErrorResponse } from '@/utils/ErrorUtils';
import { API } from '@/constants/Api';
import { useQueryClient } from 'react-query';
import withLogged from "@/HOC/withLogged";

interface IRegister {}

const schema = yup.object().shape({
  firstName: yup.string().required('First Name is required'),
  lastName: yup.string().required('Last Name is required'),
  email: yup
    .string()
    .matches(/^(?!.*@[^,]*,)/, 'Email is not in the correct format')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be longer than 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Re-enter incorrect password'),
});

const RegisterPage: React.FC<IRegister> = () => {
  const t = useTranslate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterType>({
    resolver: yupResolver<any>(schema),
  });
  const { mutateAsync, isLoading } = useRegisterApi();
  const router = useRouter();
  const [errorsResponse, setErrorsResponse] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<RegisterType> = async (data) => {
    try {
      const response = await mutateAsync(data);
      setToken(response.data);
      await queryClient.refetchQueries([API.AUTH.GET_ME]);
      await router.push('/');
    } catch (e: any) {
      setErrorsResponse([...getErrorResponse(e.message)]);
    }
  };

  return (
    <div className={'bg-via-500 px-2.5 dark:bg-via-300 w-full h-screen'}>
      <div className={'w-ful h-full flex-center flex-col'}>
        <div className={'flex items-end gap-2.5'}>
          <Image src={'/logo.svg'} alt={'Logo'} width={30} height={30} />
          <p className={'font-semibold text-xl'}>Chat app</p>
        </div>
        <p className={'mt-10 text-lg font-semibold'}>{t.auth.signUp.label}</p>
        <p className={'text-sm mt-1'}>{t.auth.signUp.description}</p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={
            'bg-white dark:bg-via-200 w-full max-w-[450px] mt-5 rounded-md p-5 space-y-3'
          }>
          <div className={'flex flex-col'}>
            <label htmlFor="FirstName" className={'text-sm ml-[1px]'}>
              {t.auth.firstName.label}
            </label>
            <input
              id="FirstName"
              type="text"
              {...register('firstName')}
              className={
                'border dark:border-night-400 bg-transparent rounded-md mt-1 py-2 text-sm px-2.5 outline-none'
              }
              placeholder={t.auth.firstName.hint}
            />
          </div>
          <div className={'flex flex-col'}>
            <label htmlFor="LastName" className={'text-sm ml-[1px]'}>
              {t.auth.lastName.label}
            </label>
            <input
              id="LastName"
              type="text"
              {...register('lastName')}
              className={
                'border dark:border-night-400 bg-transparent rounded-md mt-1 py-2 text-sm px-2.5 outline-none'
              }
              placeholder={t.auth.lastName.hint}
            />
          </div>
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
          <div className={'flex flex-col'}>
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
              placeholder={'**********'}
            />
          </div>
          <div className={'flex flex-col'}>
            <label htmlFor="ConfirmPassword" className={'text-sm ml-[1px]'}>
              {t.auth.confirmPassword.label}
            </label>
            <input
              id="ConfirmPassword"
              type="password"
              {...register('confirmPassword')}
              className={
                'border dark:border-night-400 bg-transparent rounded-md mt-1 py-2 text-sm px-2.5 outline-none'
              }
              placeholder={'**********'}
            />
          </div>
          <ul>
            {errors.firstName && (
              <li className={'text-red-500 text-[15px]'}>
                {errors.firstName.message}
              </li>
            )}
            {errors.lastName && (
              <li className={'text-red-500 text-[15px]'}>
                {errors.lastName.message}
              </li>
            )}
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
            {errors.confirmPassword && (
              <li className={'text-red-500 text-[15px]'}>
                {errors.confirmPassword.message}
              </li>
            )}
            {errorsResponse.map((item, index) => {
              return (
                <li key={index} className={'text-red-500 text-[15px]'}>
                  {item}
                </li>
              );
            })}
          </ul>
          <button
            disabled={isLoading}
            className={
              'bg-primary text-light flex-center w-full py-2 rounded-md mt-5'
            }>
            {isLoading ? <IconLoading size={'25px'} /> : t.auth.signUp.label}
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

export default withLogged(withPageLoading(RegisterPage));
