import {useRouter} from 'next/router';
import vi from '../public/lang/vi';
import en from '../public/lang/en';

const useTranslate = () => {
  const { locale } = useRouter();
  return locale === 'vi' ? vi : en;
};

export default useTranslate;
