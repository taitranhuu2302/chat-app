import React, {
  ChangeEvent,
  SyntheticEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import MainLayout from '@/layouts/MainLayout';
import Input from '@/components/Input';
import styles from '@/styles/pages/settings.module.scss';
import { AiFillFacebook, AiFillGithub } from 'react-icons/ai';
import useTranslate from '@/hooks/useTranslate';
import { AuthContext, AuthContextType } from 'contexts/AuthContext';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  useChangeAvatarApi,
  useChangePasswordApi,
  useUpdateUserInformationApi,
} from '@/service/UserService';
import { toast } from 'react-hot-toast';
import { useAppDispatch } from '@/redux/hooks';
import { onPageLoading } from '@/redux/features/PageLoadingSlice';
import withAuth from '@/HOC/withAuth';
import withPageLoading from '@/HOC/withPageLoading';
import { getErrorResponse } from '@/utils/ErrorUtils';
import Avatar from 'react-avatar';
import { useQueryClient } from 'react-query';
import { API } from '@/constants/Api';

interface IProps {}

const Settings: React.FC<IProps> = () => {
  const t = useTranslate();
  const { mutateAsync: updateInformation, isLoading: userUpdateLoading } =
    useUpdateUserInformationApi({});
  const { mutateAsync: changePassword, isLoading: changePasswordLoading } =
    useChangePasswordApi({});
  const { auth } = useContext(AuthContext) as AuthContextType;
  const [facebookLink, setFacebookLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [errorChangePassword, setErrorChangePassword] = useState<String[]>([]);
  const {
    register: registerInformation,
    setValue,
    handleSubmit: handleSubmitInformation,
  } = useForm<UserInformationType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      bio: '',
      phone: '',
      address: '',
    },
  });
  const {
    register: registerChangePassword,
    handleSubmit: handleSubmitChangePassword,
    reset: resetPassword,
  } = useForm<UserChangePasswordType>({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const dispatch = useAppDispatch();
  const { mutateAsync: changeAvatarAsync, isLoading: isLoadingChangeAvatar } =
    useChangeAvatarApi();
  const [fileAvatar, setFileAvatar] = useState<File>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (auth) {
      setValue('firstName', auth.firstName ?? '');
      setValue('lastName', auth.lastName ?? '');
      setValue('bio', auth.bio ?? '');
      setValue('phone', auth.phone ?? '');
      setValue('address', auth.address ?? '');
      setGithubLink(auth?.githubLink ?? '');
      setFacebookLink(auth?.facebookLink ?? '');
    }
  }, [auth]);

  useEffect(() => {
    dispatch(
      onPageLoading(
        userUpdateLoading || changePasswordLoading || isLoadingChangeAvatar
      )
    );
  }, [userUpdateLoading, changePasswordLoading, isLoadingChangeAvatar]);

  const onSubmitInformation: SubmitHandler<UserInformationType> = async (
    data
  ) => {
    try {
      await updateInformation(data);
      toast.success('Update information success');
    } catch (e: any) {
      console.error(e.message);
    }
  };

  const onSubmitChangePassword: SubmitHandler<UserChangePasswordType> = async (
    data
  ) => {
    try {
      await changePassword(data);
      toast.success('Change password success');
      resetPassword({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setErrorChangePassword([]);
    } catch (e: any) {
      setErrorChangePassword([...getErrorResponse(e.message)]);
    }
  };

  const handleSubmitSocial = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await updateInformation({
        facebookLink,
        githubLink,
      });
      toast.success('Update user social success');
      resetPassword({
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setErrorChangePassword([]);
    } catch (e: any) {
      console.error(e);
    }
  };

  const handleChangeAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files: FileList = target.files as FileList;
    !!files.length && setFileAvatar(files[0]);
  };

  const onSubmitChangeAvatar = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!fileAvatar) return;

    try {
      const formData = new FormData();
      formData.append('avatar', fileAvatar);
      await changeAvatarAsync(formData);
      toast.success('Change avatar successfully');
      await queryClient.refetchQueries([API.AUTH.GET_ME]);
    } catch (e: any) {
      const messages = getErrorResponse(e.message);
      toast.error(messages[0]);
    }
  };

  return (
    <>
      <MainLayout isShowTab={false}>
        <div
          className={
            'bg-via-400 dark:bg-via-200 w-full py-5 px-5 h-full overflow-y-auto'
          }>
          <div className="container mx-auto">
            <h3 className={'text-xl font-bold mb-5'}>{t.settings}</h3>
            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-5'}>
              <div className={'space-y-5'}>
                <form
                  onSubmit={onSubmitChangeAvatar}
                  className={`${styles['card-custom']} bg-base-100 flex flex-col items-center dark:bg-via-300 h-fit`}>
                  <Avatar
                    size={'150px'}
                    round
                    name={`${auth?.firstName} ${auth?.lastName}`}
                    src={
                      fileAvatar
                        ? URL.createObjectURL(fileAvatar)
                        : auth?.avatar || ''
                    }
                  />
                  <div className="form-control w-full max-w-xs">
                    <input
                      onChange={handleChangeAvatar}
                      type="file"
                      className="file-input file-input-bordered file-input-sm w-full max-w-xs"
                    />
                  </div>
                  <button disabled={userUpdateLoading} className={'btn-custom'}>
                    {t.saveChanges}
                  </button>
                </form>
                <form
                  onSubmit={handleSubmitInformation(onSubmitInformation)}
                  className={`${styles['card-custom']} bg-base-100 dark:bg-via-300 h-fit`}>
                  <Input
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'Email'}
                    value={auth?.email}
                    readOnly={true}
                  />
                  <Input
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'First Name'}
                    settings={{ ...registerInformation('firstName') }}
                  />
                  <Input
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'Last Name'}
                    settings={{ ...registerInformation('lastName') }}
                  />
                  <Input
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'Phone'}
                    settings={{ ...registerInformation('phone') }}
                  />
                  <Input
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'Address'}
                    settings={{ ...registerInformation('address') }}
                  />
                  <div className={'flex flex-col gap-1'}>
                    <label className={'text-[15px]'}>Bio</label>
                    <textarea
                      rows={5}
                      {...registerInformation('bio')}
                      className={
                        'border border-[#e5e7eb] outline-none rounded dark:border-night-500 bg-transparent p-1'
                      }></textarea>
                  </div>
                  <button disabled={userUpdateLoading} className={'btn-custom'}>
                    {t.saveChanges}
                  </button>
                </form>
              </div>
              <div className={'space-y-5'}>
                <form
                  onSubmit={handleSubmitChangePassword(onSubmitChangePassword)}
                  className={`${styles['card-custom']}  bg-base-100 dark:bg-via-300`}>
                  {!auth?.isNoPassword && (
                    <Input
                      className={`${styles['input-setting']} dark:border-night-500`}
                      label={'Current Password'}
                      settings={{ ...registerChangePassword('oldPassword') }}
                      type={'password'}
                    />
                  )}
                  <Input
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'New Password'}
                    settings={{ ...registerChangePassword('newPassword') }}
                    type={'password'}
                  />
                  <Input
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'Password Confirm'}
                    settings={{
                      ...registerChangePassword('confirmNewPassword'),
                    }}
                    type={'password'}
                  />
                  {!!errorChangePassword.length && (
                    <ul>
                      {errorChangePassword.map((er, index) => (
                        <li key={index} className={'text-red-500 text-[15px]'}>
                          {er}
                        </li>
                      ))}
                    </ul>
                  )}
                  <button className="btn-custom">{t.saveChanges}</button>
                </form>
                <form
                  onSubmit={handleSubmitSocial}
                  className={`${styles['card-custom']}  bg-base-100 dark:bg-via-300`}>
                  <Input
                    iconStart={
                      <AiFillFacebook
                        size={25}
                        className={'text-blue-600 dark:text-white'}
                      />
                    }
                    value={facebookLink}
                    onChange={(value) => setFacebookLink(value)}
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'Facebook'}
                    placeholder={'Facebook Account'}
                  />
                  <Input
                    iconStart={<AiFillGithub size={25} />}
                    className={`${styles['input-setting']} dark:border-night-500`}
                    label={'Github'}
                    value={githubLink}
                    onChange={(value) => setGithubLink(value)}
                    placeholder={'Github Account'}
                  />
                  <button className="btn-custom">{t.saveChanges}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default withAuth(withPageLoading(Settings));
