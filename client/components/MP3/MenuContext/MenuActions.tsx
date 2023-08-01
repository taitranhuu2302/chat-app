import { formatLimitText } from "@/utils/StringUtils";
import { AnimatePresence } from "framer-motion";
import React, { useRef } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsChevronRight } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { styled } from 'styled-components';
import { useOnClickOutside } from "usehooks-ts";

interface IProps {
  position: {
    x: number;
    y: number;
  },
  open: boolean;
  onClose: () => void;
  song: SongInfoType;
  handleChooseSong: () => void;
}

const MenuActions: React.FC<IProps> = ({position, open, onClose, song, handleChooseSong}) => {
  const rootRef = useRef<HTMLDivElement | null>(null)

  useOnClickOutside(rootRef, onClose)
  
  return <AnimatePresence>
    {open && (
      <div ref={rootRef} className="absolute z-20 p-3 max-w-[250px] w-full rounded-lg shadow-lg bg-[#34224f]" style={{top: `${position.y}px`, left: `${position.x}px`}}>
        <div className="flex items-center gap-2.5">
          <picture>
            <img src={song.thumbnail} className="w-[50px] h-[50px] rounded" alt="" />
          </picture>
          <div className="space-y-1">
            <p className="text-[13px] font-bold capitalize">{formatLimitText(song.title, 20)}</p>
            <p className="text-[12px]">{formatLimitText(song.artistsNames, 20)}</p>
          </div>
        </div>
        <ul className="mt-2.5">
          <MenuItem onClick={() => {
            handleChooseSong()
            onClose()
          }}>
            <div className="flex items-center gap-2.5">
              <AiFillPlayCircle size={18} />
              <span>Phát nhạc</span>
            </div>
          </MenuItem>
          <MenuItem>
            <div className="flex items-center gap-2.5">
              <IoMdAddCircle size={18} color="white" />
              <span>Thêm vào playlist</span>
            </div>
            <BsChevronRight />
          </MenuItem>
        </ul>
      </div>
    )}
  </AnimatePresence>;
};

const MenuItem = styled.li`
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 14px;
  display: flex;
  align-items: center; 
  justify-content: space-between;
  gap: 10px;
  &:hover {
    background: #493961;
  }
  transition: all 0.2s;
`


export default MenuActions;
