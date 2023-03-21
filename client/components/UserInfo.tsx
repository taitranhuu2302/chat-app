import React from 'react';
import Collapse from '@/components/Collapse';
import useTranslate from '@/hooks/useTranslate';

interface IUserInfo {

}

const UserInfo: React.FC<IUserInfo> = () => {
  const t = useTranslate();
  
  return <>
    <div className={'my-5'}>
      <p className={'text-sm text-justify mb-5'}>{`No one in the brief history of computing has ever written a piece of
       perfect software. It's unlikely that you'll be the first`}</p>
      <Collapse title={t.home.tab.profile.info.about.title} className={'border rounded dark:border-night-400'}>
        <ul className={'mt-2.5 flex flex-col gap-2.5'}>
          <li className={'flex flex-col gap-1'}>
            <span className={`text-light-600 dark:text-night-600`}>{t.home.tab.profile.info.about.name}</span>
            <p className={'text-md font-semibold'}>Tran Huu Tai</p>
          </li>
          <li className={'flex flex-col gap-1'}>
            <span className={`text-light-600 dark:text-night-600`}>{t.home.tab.profile.info.about.email}</span>
            <p className={'text-md font-semibold'}>taitranhuu2002@gmail.com</p>
          </li>
          <li className={'flex flex-col gap-1'}>
            <span className={`text-light-600 dark:text-night-600`}>{t.home.tab.profile.info.about.location}</span>
            <p className={'text-md font-semibold'}>Vietnamese</p>
          </li>
        </ul>
      </Collapse>
    </div>
  </>;
};

export default UserInfo;