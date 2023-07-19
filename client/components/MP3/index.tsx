import React, { useCallback, useEffect } from 'react'
import Sidebar from './Sidebar'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { twMerge } from 'tailwind-merge'
import { onOpenMusic } from '@/redux/features/MusicSlice'

const MP3 = () => {
  const {open} = useAppSelector(state => state.music)
  const dispatch = useAppDispatch()

  const getPositionMouse = useCallback((event: MouseEvent) => { 
    const {pageX, pageY} = event;
    console.log("🚀 ~ file: index.tsx:13 ~ getPositionMouse ~ pageX, pageY:", pageX, pageY)
  }, [])
  
  useEffect(() => {
    document.addEventListener('click', getPositionMouse)

    return () => {
      document.removeEventListener('click', getPositionMouse)
    }
  }, [getPositionMouse])
  
  return (
    <div className={twMerge('fixed z-[1001] w-full h-full left-0 top-0 bg-[#170f23] flex transition-all duration-500', !open && 'scale-0')} style={{
      transform: 'translate(1036,)'
    }}>
      {/* Sidebar */}
      <Sidebar />
      {/* End Sidebar */}
      {/* Main */}
      <div className='flex-grow p-5'>
        {/* Header */}
        <div className='flex justify-end'>
          <button className="btn btn-circle" onClick={() => dispatch(onOpenMusic(false))}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {/* End Header */}
      </div>
      {/* End Main */}
    </div>
  )
}

export default MP3