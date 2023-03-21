import React from 'react';

interface IDivider {

}

const Divider: React.FC<IDivider> = () => {
  return <div className={'w-full h-[1px] my-4 bg-light-400 dark:bg-night-400'}></div>;
};

export default Divider;