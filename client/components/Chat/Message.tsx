import React from 'react';
import Avatar from 'react-avatar';
import {BsReplyFill, BsThreeDotsVertical} from 'react-icons/bs';
import { MdOutlineDelete } from 'react-icons/md';
import moment from 'moment';
import 'moment/locale/vi';
import { useRouter } from 'next/router';

interface IMessage {
  isOwner?: boolean;
  message: MessageType;
  isFirst?: boolean;
  isSameOwner?: boolean;
  isLastSame?: boolean;
}

const Message: React.FC<IMessage> = ({
  isOwner,
  message,
  isFirst,
  isSameOwner,
  isLastSame,
}) => {
  return (
    <div className={`chat ${isOwner ? 'chat-end' : 'chat-start'}`}>
      <div className="chat-image avatar">
        <Avatar
          size={'40px'}
          src={message.sender.avatar || ''}
          round
          name={`${message.sender.firstName} ${message.sender.lastName}`}
        />
      </div>
      {!isSameOwner && (
        <div
          className={`chat-header mb-1 gap-2.5 flex items-center ${
            isOwner ? 'flex-row-reverse' : ''
          }`}>
          <span
            className={
              'font-semibold'
            }>{`${message.sender.firstName} ${message.sender.lastName}`}</span>
          {/*<time className="text-xs opacity-50">*/}
          {/*  {moment(message.updatedAt).locale('vi').format('LT')}*/}
          {/*</time>*/}
        </div>
      )}
      <div
        className={`chat-bubble  ${
          isOwner
            ? 'bg-via-500 dark:bg-via-300 text-light-1100 dark:text-night-1100'
            : 'bg-primary text-light'
        } relative max-w-[50%]`}>
        {message.text && (
          <div
            className={`tooltip un-reset ${
              isOwner ? 'tooltip-left' : 'tooltip-right'
            }`}
            data-tip={moment(message.updatedAt).locale('vi').format('LLL')}
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        )}
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
                <span>Reply</span>
                <BsReplyFill size={20}/>
              </a>
            </li>
            {
              isOwner && (
                <li>
                  <a
                    className={
                      'flex items-center justify-between text-light-1100 dark:text-night-1100'
                    }>
                    <span>Delete</span>
                    <MdOutlineDelete size={22} />
                  </a>
                </li>
              )
            }
          </ul>
        </div>
      </div>
      {/*<div className="chat-footer opacity-50">Delivered</div>*/}
    </div>
  );
};

export default Message;
