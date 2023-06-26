import { ComponentType, FC, useEffect, useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import LoadingPage from '@/components/Loading';

interface HOCProps {}

function withHOC<T extends object>(
  WrappedComponent: ComponentType<T>
): FC<T & HOCProps> {
  return function WithHOC(props: T & HOCProps) {
    const { isPageLoading } = useAppSelector((state) => state.pageLoading);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingTimer, setLoadingTimer] = useState<NodeJS.Timeout | null>(
      null
    );

    useEffect(() => {
      if (!isLoading) {
        clearTimeout(loadingTimer!);
        setLoadingTimer(null);
        return;
      }

      setLoadingTimer(
        setTimeout(() => {
          setIsLoading(false);
        }, 500)
      );
    }, [isLoading]);

    useEffect(() => {
      if (isPageLoading) {
        setIsLoading(true);
      }
    }, [isPageLoading]);
    return (
      <>
        {isLoading && <LoadingPage floating={true} />}
        <WrappedComponent {...props} />
      </>
    );
  };
}

export default withHOC;
