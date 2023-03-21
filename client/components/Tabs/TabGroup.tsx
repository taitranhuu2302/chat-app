import React from 'react';
import TabContainer from '@/components/Tabs/TabContainer';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import Input from '@/components/Input';
import { IoSearchOutline } from 'react-icons/io5';
import Avatar from 'react-avatar';
import ModalCreateGroup from '@/components/Modals/ModalCreateGroup';
import useTranslate from '@/hooks/useTranslate';

interface ITabGroup {

}

const TabGroup: React.FC<ITabGroup> = () => {
  const t = useTranslate()
  
  return <>
    <TabContainer title={t.home.tab.group.title} headerActions={
      <>
        <ModalCreateGroup />
      </>
    }>
      <Input className={'mt-5'} placeholder={t.home.tab.group.searchHint} iconStart={<IoSearchOutline size={20} />} />
      <div className={'py-5 flex flex-col flex-grow'}>
        <div className={'flex flex-col h-0 flex-grow overflow-y-auto scrollbar'}>
          {Array(20).fill(0).map((_, index) => {
            return (
              <TabGroupItem key={index}/>
            )
          })}
        </div>
      </div>
    </TabContainer>
  </>;
};

type TabGroupItemType = {

}

const TabGroupItem = ({}: TabGroupItemType) => {
  return (
    <div className={'flex items-center gap-2.5 dark:hover:bg-via-300 hover:bg-via-500 cursor-pointer p-3 rounded'}>
      <Avatar name={'Tran Huu Tai'} size={'40px'} round/>
      <div className={'flex-grow'}>
        <p className={'text-md font-semibold'}>#Developer</p>
      </div>
      <div className={'flex-center'}>
        <span className="badge bg-info">New</span>
      </div>
    </div>
  )
}

export default TabGroup;