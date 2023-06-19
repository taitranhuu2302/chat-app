import React, { useId } from 'react';
import { twMerge } from 'tailwind-merge';

interface IInput {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  iconStart?: React.ReactNode;
  className?: string;
  label?: string;
  readOnly?: boolean;
  settings?: any
  type?: string;
}

const Input: React.FC<IInput> = ({
  placeholder,
  onChange,
  value,
  iconStart,
  className,
  label,
  readOnly = false,
  settings,
  type = "text"
}) => {
  const id = useId();
  return (
    <>
      <div className={'flex flex-col gap-1'}>
        {label && (
          <label
            htmlFor={id}
            className={'text-[15px] text-light-1100 dark:text-night-1100'}>
            {label}
          </label>
        )}
        <div
          className={twMerge(
            'relative flex items-center rounded pl-2 pr-5 py-2.5 bg-via-500 dark:bg-via-300 w-full',
            className
          )}>
          {iconStart && <div>{iconStart}</div>}
          <input
            type={type}
            value={value}
            id={id}
            readOnly={readOnly}
            onChange={(e) => onChange && onChange(e.target.value)}
            className={twMerge(
              `bg-transparent ${iconStart ? 'pl-4' : ''} outline-none w-full`
            )}
            placeholder={placeholder}
            {...settings}
          />
        </div>
      </div>
    </>
  );
};

export default Input;
