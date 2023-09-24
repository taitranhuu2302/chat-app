import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import Chat from '@/components/Chat';
import withAuth from '@/HOC/withAuth';

interface IRoomDetail {}

const RoomDetail: React.FC<IRoomDetail> = () => {

  return <>
    <MainLayout>
      <Chat />
    </MainLayout>
  </>;
};

export default withAuth(RoomDetail);