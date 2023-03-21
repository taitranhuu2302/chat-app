import React from 'react';
import { twMerge } from 'tailwind-merge';

interface IInput {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  iconStart?: React.ReactNode;
  className?: string;
}

const Input: React.FC<IInput> = ({ placeholder, onChange, value, iconStart, className }) => {
  
  return <>
    <div
      className={twMerge('relative flex items-center rounded px-5 py-2.5 bg-via-500 dark:bg-via-300 w-full', className)}>
      {
        iconStart && (
          <div>
            {iconStart}
          </div>
        )
      }
      <input type='text' value={value} onChange={(e) => onChange && onChange(e.target.value)}
             className={twMerge(`bg-via-500 dark:bg-via-300 ${iconStart ? 'pl-4' : ''} outline-none w-full`)}
             placeholder={placeholder} />
    </div>
  </>;
};

export default Input;