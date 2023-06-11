import { ComponentType, FC } from 'react';
import { useAppSelector } from '../redux/hooks';
import LoadingPage from '@/components/Loading';

interface HOCProps {}

function withHOC<T extends object>(
  WrappedComponent: ComponentType<T>
): FC<T & HOCProps> {
  return function WithHOC(props: T & HOCProps) {
    const { isPageLoading } = useAppSelector((state) => state.pageLoading);

    return (
      <>
        {isPageLoading && <LoadingPage floating={true} />}
        <WrappedComponent {...props} />
      </>
    );
  };
}

export default withHOC;
