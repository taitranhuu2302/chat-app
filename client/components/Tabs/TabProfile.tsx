import React, { useContext } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import TabContainer from '@/components/Tabs/TabContainer';
import AvatarCustom from '@/components/AvatarCustom';
import UserInfo from '@/components/UserInfo';
import Divider from '@/components/Divider';
import useTranslate from '@/hooks/useTranslate';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';

interface ITabProfile {}

const TabProfile: React.FC<ITabProfile> = () => {
  const t = useTranslate();
  const { auth } = useContext(AuthContext) as AuthContextType;

  return (
    <TabContainer
      title={t.home.tab.profile.title}
      headerActions={
        <>
          <div className={'dropdown'}>
            <button tabIndex={0}>
              <BsThreeDotsVertical size={20} />
            </button>
            <ul
              tabIndex={0}
              className={
                'dropdown-content dark:bg-night-200 menu p-2 shadow bg-base-100 rounded-box w-52'
              }>
              <li>
                <a>{t.home.tab.profile.actions.edit}</a>
              </li>
            </ul>
          </div>
        </>
      }>
      <AvatarCustom
        src={auth?.avatar}
        name={`${auth?.firstName} ${auth?.lastName}`}
      />
      <Divider />
      <UserInfo />
    </TabContainer>
  );
};

export default TabProfile;
