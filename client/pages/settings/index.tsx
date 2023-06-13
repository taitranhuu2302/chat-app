import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import Input from '@/components/Input';
import styles from '@/styles/pages/settings.module.scss';
import { AiFillFacebook, AiFillGithub } from 'react-icons/ai';

interface IProps {}

const Settings: React.FC<IProps> = () => {
  return (
    <>
      <MainLayout isShowTab={false}>
        <div className="container mx-auto my-5 px-5">
          <h3 className={'text-xl font-bold mb-5'}>Settings</h3>
          <div className={'grid grid-cols-1 md:grid-cols-2 gap-5'}>
            <form
              className={`${styles['card-custom']} bg-base-100 dark:bg-via-300`}>
              <Input
                className={`${styles['input-setting']} dark:border-night-500`}
                label={'Name'}
              />
              <Input
                className={`${styles['input-setting']} dark:border-night-500`}
                label={'Phone'}
              />
              <Input
                className={`${styles['input-setting']} dark:border-night-500`}
                label={'Email'}
              />
              <div className={'flex flex-col gap-1'}>
                <label className={'text-[15px]'}>Bio</label>
                <textarea
                  name=""
                  id=""
                  rows={5}
                  className={
                    'border border-[#e5e7eb] outline-none rounded dark:border-night-500 bg-transparent p-1'
                  }></textarea>
              </div>
              <button className={'btn-custom'}>Save Settings</button>
            </form>
            <div className={'space-y-5'}>
              <form
                className={`${styles['card-custom']}  bg-base-100 dark:bg-via-300`}>
                <Input
                  className={`${styles['input-setting']} dark:border-night-500`}
                  label={'Current Password'}
                />
                <Input
                  className={`${styles['input-setting']} dark:border-night-500`}
                  label={'New Password'}
                />
                <Input
                  className={`${styles['input-setting']} dark:border-night-500`}
                  label={'Password Confirm'}
                />
                <button className="btn-custom">Change Password</button>
              </form>
              <form
                className={`${styles['card-custom']}  bg-base-100 dark:bg-via-300`}>
                <Input
                  iconStart={
                    <AiFillFacebook size={25} className={'text-blue-600'} />
                  }
                  className={`${styles['input-setting']} dark:border-night-500`}
                  label={'Facebook'}
                  placeholder={'Facebook Account'}
                />
                <Input
                  iconStart={<AiFillGithub size={25} />}
                  className={`${styles['input-setting']} dark:border-night-500`}
                  label={'Github'}
                  placeholder={'Github Account'}
                />
                <button className="btn-custom">Save Change</button>
              </form>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
};

export default Settings;
