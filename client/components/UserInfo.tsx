import React, { useContext } from 'react';
import Collapse from '@/components/Collapse';
import useTranslate from '@/hooks/useTranslate';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import Divider from "@/components/Divider";

interface IUserInfo {
  user?: UserType | null
}

const UserInfo: React.FC<IUserInfo> = ({user}) => {
  const t = useTranslate();

  return (
    <>
      <div className={'my-5'}>
        <p className={'text-sm text-justify mb-5'}>{user?.bio}</p>
        <Collapse
          title={t.home.tab.profile.info.about.title}
          className={'border rounded dark:border-night-400'}>
          <ul className={'mt-2.5 flex flex-col gap-2.5'}>
            <li className={'flex flex-col gap-1'}>
              <span className={`text-light-600 dark:text-night-600`}>
                {t.home.tab.profile.info.about.name}
              </span>
              <p className={'text-md font-semibold'}>
                {user?.firstName} {user?.lastName}
              </p>
            </li>
            <li className={'flex flex-col gap-1'}>
              <span className={`text-light-600 dark:text-night-600`}>
                {t.home.tab.profile.info.about.email}
              </span>
              <p className={'text-md font-semibold'}>{user?.email}</p>
            </li>
            <li className={'flex flex-col gap-1'}>
              <span className={`text-light-600 dark:text-night-600`}>
                {t.home.tab.profile.info.about.location}
              </span>
              <p className={'text-md font-semibold'}>{user?.address}</p>
            </li>
            <li className={'flex flex-col gap-1'}>
              <span className={`text-light-600 dark:text-night-600`}>
                {t.home.tab.profile.info.about.phone}
              </span>
              <p className={'text-md font-semibold'}>{user?.phone}</p>
            </li>
            <li className={'flex flex-col gap-1'}>
              <span className={`text-light-600 dark:text-night-600`}>
                Facebook
              </span>
              <p className={'text-md font-semibold'}>{user?.facebookLink}</p>
            </li>
            <li className={'flex flex-col gap-1'}>
              <span className={`text-light-600 dark:text-night-600`}>
                Github
              </span>
              <p className={'text-md font-semibold'}>{user?.githubLink}</p>
            </li>
          </ul>
        </Collapse>
      </div>
    </>
  );
};

export default UserInfo;
