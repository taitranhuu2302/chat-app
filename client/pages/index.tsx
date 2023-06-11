import MainLayout from '@/layouts/MainLayout';
import Image from 'next/image';
import useTranslate from '@/hooks/useTranslate';

export default function Home() {
  const t = useTranslate();
  
  return (
    <MainLayout>
      <div className={'hidden lg:flex items-center justify-center w-full h-full flex-col gap-5 dark:bg-via-100'}>
        <Image src={'/logo.svg'} alt={''} width={100} height={100} />
        <p className={'text-xl font-semibold'}>{t.home.welcome}</p>
      </div>
    </MainLayout>
  );
}
