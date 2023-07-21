import React, { useCallback, useMemo, useEffect, useRef, useState } from 'react'
import Sidebar from './Sidebar'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { twMerge } from 'tailwind-merge'
import { onOpenMusic } from '@/redux/features/MusicSlice'
import Header from './Header'
import Charts from './Charts'

const MP3 = () => {
  const {open} = useAppSelector(state => state.music)
  const [tabActive, setTabActive] = useState<SidebarMP3>("charts")
  const rootRef = useRef<HTMLDivElement | null>(null)
  
  const renderContent = useMemo(() =>{ 
    switch (tabActive) {
      case "charts":
        return <Charts />;
      case "library":
        return <div>Library</div>
      case "search":
        return <div>Search</div>
      default:
        
        return <Charts />;
    }
  }, [tabActive])
  
  return (
    <div ref={rootRef} className={twMerge('fixed z-[1001] w-full h-full left-0 top-0 bg-[#170f23] flex transition-all duration-500', !open && 'scale-0')}>
      {/* Sidebar */}
      <Sidebar tabActive={tabActive} setTabActive={setTabActive}/>
      {/* End Sidebar */}
      {/* Main */}
      <div className='flex-grow p-5'>
        {/* Header */}
        <Header />
        {/* End Header */}
        {renderContent}
      </div>
      {/* End Main */}
    </div>
  )
}

export default MP3