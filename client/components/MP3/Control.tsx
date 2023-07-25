import React, {PropsWithChildren} from 'react';
import {IoPauseCircleOutline, IoPlayCircleOutline, IoShuffleOutline } from 'react-icons/io5';
import {MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { RxLoop } from 'react-icons/rx';
import Slider from './Slider';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { convertSecondToMinute } from '@/utils/TimerUtils';
import { setCurrentTime, setIsPlaying } from '@/redux/features/MusicSlice';
import eventBus from '@/config/EventBus';
import { CHANGE_CURRENT_TIME } from '@/constants/Music';
interface IProps {

}

const Control: React.FC<PropsWithChildren<IProps>> = () => {
  const songCurrent = useAppSelector(state => state.music.songCurrent)
  const currentTime = useAppSelector(state => state.music.currentTime)
  const isPlaying = useAppSelector(state => state.music.isPlaying)
  const dispatch = useAppDispatch()

  return <div className={'max-w-[40vw] w-full space-y-2.5 px-2.5'}>
    <div className={'flex-center gap-[20px]'}>
      <button className={'item-hover'}><IoShuffleOutline size={25}/></button>
      <button className={'item-hover'}><MdSkipPrevious size={28}/></button>
      <button className={'item-hover'} onClick={() => dispatch(setIsPlaying(null))}>
        {isPlaying ? <IoPauseCircleOutline size={40}/> : <IoPlayCircleOutline size={40}/>}
      </button>
      <button className={'item-hover'}><MdSkipNext size={28}/></button>
      <button className={'item-hover'}><RxLoop size={21}/></button>
    </div>
    <div className={'flex items-center gap-2.5'}>
      <p className={'text-[14px] min-w-[40px] font-semibold text-[#837f88]'}>{convertSecondToMinute(Number(currentTime.toFixed(0)))}</p>
      <Slider 
        values={[currentTime]}
        max={songCurrent?.duration || 1}
        setValues={(n: number[]) => {
          eventBus.emit(CHANGE_CURRENT_TIME, n[0])
        }}
      />
      <p className={'text-[14px] min-w-[40px] font-semibold'}>{songCurrent?.duration ? convertSecondToMinute(songCurrent?.duration) : `00:00`}</p>
    </div>
  </div>
}

export default Control;