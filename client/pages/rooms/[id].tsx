import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import {useRouter} from 'next/router';
import Chat from '@/components/Chat';
import withAuth from '@/HOC/withAuth';

interface IRoomDetail {

}

const RoomDetail: React.FC<IRoomDetail> = () => {
  const router = useRouter();
  const { query: { id } } = router;
  
  return <>
    <MainLayout>
      <Chat />
    </MainLayout>
  </>;
};

export default withAuth(RoomDetail);