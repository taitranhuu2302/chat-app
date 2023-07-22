import React, {PropsWithChildren} from 'react';
import {IoPauseCircleOutline, IoShuffleOutline } from 'react-icons/io5';
import {MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { RxLoop } from 'react-icons/rx';
import Slider from './Slider';
interface IProps {

}

const Control: React.FC<PropsWithChildren<IProps>> = () => {
  return <div className={'max-w-[40vw] w-full space-y-2.5 px-2.5'}>
    <div className={'flex-center gap-[20px]'}>
      <button className={'item-hover'}><IoShuffleOutline size={25}/></button>
      <button className={'item-hover'}><MdSkipPrevious size={28}/></button>
      <button className={'item-hover'}><IoPauseCircleOutline size={40}/></button>
      <button className={'item-hover'}><MdSkipNext size={28}/></button>
      <button className={'item-hover'}><RxLoop size={21}/></button>
    </div>
    <div className={'flex items-center gap-2.5'}>
      <p className={'text-[14px] font-semibold text-[#837f88]'}>00:34</p>
      <Slider />
      <p className={'text-[14px] font-semibold'}>03:24</p>
    </div>
  </div>
}

export default Control;