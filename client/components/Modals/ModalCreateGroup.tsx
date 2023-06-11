import React, {useContext} from 'react';
import {AiOutlineUsergroupAdd} from 'react-icons/ai';
import {IoClose} from 'react-icons/io5';
import Divider from '@/components/Divider';
import Select, {StylesConfig} from 'react-select';
import {DarkModeContext} from '../../contexts/DarkModeProvider';
import useTranslate from '@/hooks/useTranslate';

interface IModalCreateGroup {

}

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

const colorStyles: StylesConfig = {
  control: (styles) => ({...styles, backgroundColor: '#36404A'}),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: '#36404A',
      ':active' : {
        ...styles[':active'],
        backgroundColor: '#303841'
      }
    }
  },
  multiValue: (styles, { data }) => {
    return {
      ...styles,
      backgroundColor: '#303841',
    };
  },
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    color: 'white',
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    color: 'white',
    ':hover': {
      backgroundColor: '#303841',
      color: 'white',
    },
  }),
}


const ModalCreateGroup: React.FC<IModalCreateGroup> = () => {
  const {theme} = useContext(DarkModeContext)
  const t = useTranslate();
  
  return <>
    <div>
      <label data-tip={t.home.tab.group.title} htmlFor='modal-create-group' className={'tooltip cursor-pointer tooltip-left'}>
        <AiOutlineUsergroupAdd size={25} />
      </label>
      
      <input type='checkbox' id='modal-create-group' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box dark:bg-via-100 max-h-[500px] min-h-[400px]'>
          <div className={'flex justify-between items-center'}>
            <h4 className={'text-lg font-semibold'}>{t.home.tab.group.createGroup.title}</h4>
            <label htmlFor='modal-create-group' className={'cursor-pointer'}>
              <IoClose size={20}/>
            </label>
          </div>
          <Divider />
          <form className={'flex flex-col gap-2.5 h-full'}>
            <div className={'flex flex-col gap-2.5'}>
              <label htmlFor='group-name' className={'text-md'}>{t.home.tab.group.createGroup.groupName.label}</label>
              <input type='text' id={'group-name'} placeholder={t.home.tab.group.createGroup.groupName.hint} className={'outline-none border dark:bg-via-300 py-1.5 px-2.5 rounded'}/>
            </div>
            <div className={'flex flex-col gap-2.5'}>
              <label htmlFor='group-members' className={'text-md'}>{t.home.tab.group.createGroup.groupMember.label}</label>
              <Select
                isMulti
                id={'group-members'}
                options={options}
                className={'select-custom'}
                placeholder={t.home.tab.group.createGroup.groupMember.hint}
                classNamePrefix="select"
                styles={theme === 'dark' ? colorStyles : {}}
              />
              <div className={'flex flex-col gap-2.5'}>
                <label htmlFor='group-description' className={'text-md'}>{t.home.tab.group.createGroup.groupDesc.label}</label>
                <textarea placeholder={t.home.tab.group.createGroup.groupDesc.hint} className={'outline-none border dark:bg-via-300 py-1.5 px-2.5 rounded'}></textarea>
              </div>
            </div>
            
            <div className='modal-action flex-grow'>
              <label htmlFor='modal-create-group' className='btn btn-sm btn-error'>{t.home.tab.group.createGroup.closeText}</label>
              <label htmlFor='modal-create-group' className='btn btn-sm btn-primary'>{t.home.tab.group.createGroup.submitText}</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  </>;
};

export default ModalCreateGroup;