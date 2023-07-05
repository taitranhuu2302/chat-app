import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { twMerge } from 'tailwind-merge';

interface IProps {
    isOwner: boolean;
}

const MessageSkeleton: React.FC<IProps> = ({ isOwner }) => {
    return (
        <div className={twMerge('flex my-2.5 gap-2.5 items-end', isOwner && 'justify-start flex-row-reverse')}>
            <Skeleton circle width={40} height={40} />
            <Skeleton width={150} height={50} />
        </div>
    )
}

export default MessageSkeleton