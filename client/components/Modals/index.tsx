import React, { PropsWithChildren, useId } from 'react'
import { IoClose } from 'react-icons/io5';
import { twMerge } from 'tailwind-merge';

interface IProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  isButtonClose?: boolean;
}

const Modal: React.FC<PropsWithChildren<IProps>> = ({ children, open, onClose, title, isButtonClose }) => {
  const id = useId()

  const handleClose = (e: any) => {
    if (e.target.getAttribute('data-modal') === `modal-${id}`) {
      onClose()
    }
  }

  return (
    <div onClick={handleClose} data-modal={`modal-${id}`} className={twMerge('modal modal-override', open && 'active')}>
      <div className="modal-box dark:bg-via-300">
        {title && <p className='flex-center text-xl font-semibold capitalize mb-3'>{title}</p>}
        {isButtonClose && <button onClick={onClose} className='absolute top-[10px] right-[10px]'><IoClose size={30} /></button>}
        {children}
      </div>
    </div>
  )
}

export default Modal