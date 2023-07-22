import React from 'react'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import MediaItem from "@/components/MP3/MediaItem";

const Charts = () => {
  return (
    <div className={'h-full flex flex-col overflow-auto'}>
      <div className={'flex items-center gap-3'}>
        <p className={'text-3xl tracking-wide text-white font-bold'}>BXH Nhạc Mới</p>
        <button><BsFillPlayCircleFill size={30} color={'white'}/></button>
      </div>
      <div className={'space-y-2.5 py-2.5'}>
        {
          Array(20).fill(0).map((_, index) => (
            <MediaItem key={index}/>
          ))
        }
      </div>
    </div>
  )
}

export default Charts