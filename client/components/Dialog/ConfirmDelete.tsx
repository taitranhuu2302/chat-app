import React from 'react';
import useTranslate from '@/hooks/useTranslate';

interface IProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  message?: string;
}

const ConfirmDelete: React.FC<IProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  const t: any = useTranslate();
  return (
    <>
      <dialog className={`modal modal-override ${isOpen ? 'active' : ''}`}>
        <div className="modal-box dark:bg-via-300">
          <h3 className="font-bold text-lg">{title ? title : 'Title'}</h3>
          <p className="py-4">
            {message ? message : 'Do you want to delete this?'}
          </p>
          <div className="modal-action">
            <button onClick={onConfirm} className="btn btn-error text-white">
              {t.confirm}
            </button>
            <button className="btn" onClick={onClose}>
              {t.close}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmDelete;
