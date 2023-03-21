import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import TabContainer from '@/components/Tabs/TabContainer';
import Avatar from 'react-avatar';
import Collapse from '@/components/Collapse';
import { RxDotFilled } from 'react-icons/rx';
import AvatarCustom from '@/components/AvatarCustom';
import UserInfo from '@/components/UserInfo';
import Divider from '@/components/Divider';
import useTranslate from '@/hooks/useTranslate';

interface ITabProfile {

}


const TabProfile: React.FC<ITabProfile> = () => {
  const t = useTranslate();
  
  return <TabContainer title={t.home.tab.profile.title} headerActions={
    <>
      <div className={'dropdown'}>
        <button tabIndex={0}>
          <BsThreeDotsVertical size={20} />
        </button>
        <ul tabIndex={0} className={'dropdown-content dark:bg-night-200 menu p-2 shadow bg-base-100 rounded-box w-52'}>
          <li><a>{t.home.tab.profile.actions.edit}</a></li>
        </ul>
      </div>
    </>
  }>
    <AvatarCustom />
    <Divider />
    <UserInfo />
  </TabContainer>;
};

export default TabProfile;