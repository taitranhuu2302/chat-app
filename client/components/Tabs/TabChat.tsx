import React from 'react';
import TabContainer from '@/components/Tabs/TabContainer';
import Input from '@/components/Input';
import { IoSearchOutline } from 'react-icons/io5';
import Avatar from 'react-avatar';
import { useRouter } from 'next/router';
import useTranslate from '@/hooks/useTranslate';

interface ITabChat {

}

const TabChat: React.FC<ITabChat> = () => {
  const t = useTranslate();
  
  return <>
    <TabContainer title={t.home.tab.chat.title}>
      <Input className={'mt-5'} placeholder={t.home.tab.chat.searchHint} iconStart={<IoSearchOutline size={20} />} />
      <div className={'py-5 flex flex-col flex-grow'}>
        <p className={'py-2.5 text-lg flex-shrink font-semibold'}>{t.home.tab.chat.recent}</p>
        <div className={'flex flex-col h-0 flex-grow overflow-y-auto scrollbar'}>
          {Array(20).fill(0).map((_, index) => {
            return (
              <TabChatItem key={index} />
            );
          })}
        </div>
      </div>
    </TabContainer>
  </>;
};

type TabChatItemType = {}

const TabChatItem = ({}: TabChatItemType) => {
  const router = useRouter();
  
  return (
    <div onClick={async () => {
      await router.push({
        pathname: `/rooms/[id]`,
        query: {
          ...router.query,
          id: 1
        },
      });
    }}
         className={'flex items-center gap-2.5 cursor-pointer dark:hover:bg-via-300 hover:bg-via-500 p-4 transition-all duration-500'}>
      <Avatar round name={'Tran Huu Tai'} size={'40px'} />
      <div className={'flex flex-col flex-grow'}>
        <p className={'text-md font-semibold'}>Tran Huu Tai</p>
        <p className={'text-sm font-light text-light-600 dark:text-night-600'}>Xin chao moi nguoi</p>
      </div>
      <div className={'flex flex-col items-center gap-1'}>
        <p className={'text-sm text-light-600 dark:text-night-600'}>02:50</p>
        <div className='badge badge-sm'>5</div>
      </div>
    </div>
  );
};

export default TabChat;