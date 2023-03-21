import { useContext } from 'react';
import { DarkModeContext, IDarkModeContext } from '../contexts/DarkModeProvider';
import MainLayout from '@/layouts/MainLayout';
import Image from 'next/image';
import useTranslate from '@/hooks/useTranslate';

export default function Home() {
  const { onSetTheme, theme } = useContext(DarkModeContext) as IDarkModeContext;
  const t = useTranslate();
  
  return (
    <MainLayout>
      <div className={'hidden lg:flex items-center justify-center w-full h-full flex-col gap-5'}>
        <Image src={'/logo.svg'} alt={''} width={100} height={100} />
        <p className={'text-xl font-semibold'}>{t.home.welcome}</p>
      </div>
    </MainLayout>
  );
}
