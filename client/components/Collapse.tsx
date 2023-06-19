import React from 'react';
import {twMerge} from 'tailwind-merge';

interface ICollapse {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Collapse: React.FC<ICollapse> = ({ title, children, className }) => {
  
  return <>
    <div className={twMerge('collapse collapse-arrow', className)}>
      <input type='checkbox' />
      <div className='collapse-title text-md font-medium bg-light dark:bg-via-300 rounded-tl rounded-tr'>
        {title}
      </div>
      <div className='collapse-content bg-white dark:bg-via-100 rounded-bl rounded-br'>
        {children}
      </div>
    </div>
  </>;
};

export default Collapse;