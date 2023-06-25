import React from 'react';
import Avatar from 'react-avatar';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdContentCopy, MdOutlineDelete } from 'react-icons/md';

interface IMessage {
  isOwner?: boolean;
  message: string;
  isFirst?: boolean;
}

const Message: React.FC<IMessage> = ({ isOwner, message, isFirst }) => {
  return (
    <div className={`chat ${isOwner ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <Avatar size={'40px'} round name={'Tran Huu Tai'} />
      </div>
      <div
        className={`chat-header mb-1 gap-2.5 flex items-center ${
          isOwner ? 'flex-row-reverse' : ''
        }`}>
        <span className={'font-semibold'}>Tran Huu Tai</span>
        <time className="text-xs opacity-50">12:45</time>
      </div>
      <div
        className={`chat-bubble  ${
          isOwner
            ? 'bg-via-500 dark:bg-via-300 text-light-1100 dark:text-night-1100'
            : 'bg-primary text-light'
        } relative max-w-[50%]`}>
        <div dangerouslySetInnerHTML={{ __html: message }} />
        <div
          className={`absolute dropdown ${
            isFirst ? 'dropdown-bottom' : 'dropdown-top'
          } ${
            isOwner
              ? 'left-[-15px] dropdown-left'
              : 'right-[-15px] dropdown-right'
          } top-0`}>
          <button tabIndex={0}>
            <BsThreeDotsVertical size={15} className={'text-primary'} />
          </button>
          <ul
            tabIndex={0}
            className="dropdown-content menu p-2 shadow bg-light dark:bg-via-300 rounded-box w-52">
            <li>
              <a
                className={
                  'flex items-center justify-between text-light-1100 dark:text-night-1100'
                }>
                <span>Copy</span>
                <MdContentCopy size={20} />
              </a>
            </li>
            <li>
              <a
                className={
                  'flex items-center justify-between text-light-1100 dark:text-night-1100'
                }>
                <span>Delete</span>
                <MdOutlineDelete size={22} />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="chat-footer opacity-50">Delivered</div>
    </div>
  );
};

export default Message;
