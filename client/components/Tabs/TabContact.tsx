import React, { useEffect, useState } from 'react';
import TabContainer from '@/components/Tabs/TabContainer';
import Input from '@/components/Input';
import { IoSearchOutline } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FakeUser } from '@/components/Tabs/FakeUser';
import _ from 'lodash';
import { useEffectOnce } from 'usehooks-ts';
import { groupByFirstLetter } from '../../utils/ArrayUtils';
import useTranslate from '@/hooks/useTranslate';

interface ITabContact {

}

const TabContact: React.FC<ITabContact> = () => {
  const t = useTranslate();
  const [contacts, setContacts] = useState<any>([]);
  
  useEffectOnce(() => {
    setContacts([...groupByFirstLetter(_.sortBy(FakeUser, value => value.name), item => item.name[0])])
  })
  
  return <>
    <TabContainer title={t.home.tab.contact.title}>
      <Input className={'mt-5'} placeholder={t.home.tab.contact.searchHint} iconStart={<IoSearchOutline size={20} />} />
      <div className={'flex px-2.5 flex-col h-0 flex-grow overflow-y-auto scrollbar mt-5'}>
        {
          contacts.map((item: any, index: number) => {
            return (
              <div key={index} className={'py-2.5'}>
                <p className={'text-primary font-semibold'}>{item.name}</p>
                {
                  item.list.map((subItem: any, subIndex: number) => {
                    return (
                      <TabContactItem isLastItem={contacts.length - 1 === index} user={subItem} key={subItem.id} />
                    )
                  })
                }
              </div>
            )
          })
        }
      </div>
    </TabContainer>
  </>;
};

type TabContactItemType = {
  user: any;
  isLastItem?: boolean
}

const TabContactItem = ({user, isLastItem}: TabContactItemType) => {
  const t = useTranslate();
  let idRandom = Math.random();
  
  return (
    <div className={'cursor-pointer py-4 flex items-center'}>
      <p className={'flex-grow'}>{user.name}</p>
      <div className={`dropdown dropdown-left ${isLastItem ? 'dropdown-top' : ''}`}>
        <label tabIndex={idRandom} className="cursor-pointer">
          <BsThreeDotsVertical size={20} />
        </label>
        <ul tabIndex={idRandom} className="dropdown-content menu p-2 shadow bg-via-400 dark:bg-via-300 rounded-box w-52">
          <li><a>{t.home.tab.contact.itemActions.share}</a></li>
          <li><a>{t.home.tab.contact.itemActions.block}</a></li>
          <li><a>{t.home.tab.contact.itemActions.remove}</a></li>
        </ul>
      </div>
    </div>
  )
}

export default TabContact;