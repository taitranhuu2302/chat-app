import React, { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

interface IProps {
  text: string;
  className?: string;
}

const TextBouncing: React.FC<PropsWithChildren<IProps>> = ({ text , className}) => {
  const characters = text.split('');

  return (
    <>
      <div className={twMerge('waviy', className)}>
        {characters.map((char, index) => (
          <span key={index} style={{ '--i': index + 1 }}>
            {char}
          </span>
        ))}
      </div>
    </>
  );
};

export default TextBouncing;
