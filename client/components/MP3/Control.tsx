import eventBus from '@/config/EventBus';
import { CHANGE_CURRENT_TIME } from '@/constants/Music';
import { setIsLoop, setIsPlaying, setIsRandom, setSongChange } from '@/redux/features/MusicSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { convertSecondToMinute } from '@/utils/TimerUtils';
import React, { PropsWithChildren } from 'react';
import {
  IoPauseCircleOutline,
  IoPlayCircleOutline,
  IoShuffleOutline,
} from 'react-icons/io5';
import { MdSkipNext, MdSkipPrevious } from 'react-icons/md';
import { RxLoop } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';
import Slider from './Slider';

interface IProps {

}

const Control: React.FC<PropsWithChildren<IProps>> = () => {
  const songCurrent = useAppSelector(state => state.music.songCurrent)
  const currentTime = useAppSelector(state => state.music.currentTime)
  const isPlaying = useAppSelector(state => state.music.isPlaying)
  const dispatch = useAppDispatch()
  const isLoop = useAppSelector(state => state.music.isLoop)
  const isRandom = useAppSelector(state => state.music.isRandom)

  return <div className={'max-w-[40vw] w-full space-y-2.5 px-2.5'}>
    <div className={'flex-center gap-[20px]'}>
      <button className={twMerge('item-hover', isRandom && 'item-active')} onClick={() => dispatch(setIsRandom())}><IoShuffleOutline size={25}/></button>
      <button className={'item-hover'} onClick={() => dispatch(setSongChange("Previous"))}><MdSkipPrevious size={28}/></button>
      <button className={'item-hover'} onClick={() => dispatch(setIsPlaying(null))}>
        {isPlaying ? <IoPauseCircleOutline size={40}/> : <IoPlayCircleOutline size={40}/>}
      </button>
      <button className={'item-hover'} onClick={() => dispatch(setSongChange("Next"))}><MdSkipNext size={28}/></button>
      <button className={twMerge('item-hover', isLoop && 'item-active')} onClick={() => dispatch(setIsLoop())}><RxLoop size={21}/></button>
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