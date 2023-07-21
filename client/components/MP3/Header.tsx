import { onOpenMusic } from '@/redux/features/MusicSlice'
import { useAppDispatch } from '@/redux/hooks'
import React from 'react'
import { IoSearchOutline } from 'react-icons/io5'

interface IProps {

}

const Header: React.FC<IProps> = () => {
  const dispatch = useAppDispatch()
  
  return (
    <div className='flex items-center justify-between'>
      <div className='flex max-w-[440px] w-full items-center bg-[#30293b] h-[40px] rounded-[20px] px-2'>
        <button>
          <IoSearchOutline color='white' size={25}/>
        </button>
        <input type="text" className='flex-grow outline-none pl-2.5 pr-5 border-none bg-transparent text-white' placeholder='Tìm kiếm bài hát'/>
      </div>
      <div className="flex items-center gap-2.5">
        {/* <Avatar src={auth?.avatar || ""} name={`${auth?.firstName} ${auth?.lastName}`} size={`40px`} round/> */}
        <button className="bg-white w-[40px] hover:opacity-90 h-[40px] rounded-full flex-center" onClick={() => dispatch(onOpenMusic(false))}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  )
}

export default Header