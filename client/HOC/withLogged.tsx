import { ComponentType, FC, useContext, useEffect } from 'react';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import { useRouter } from 'next/router';
import LoadingPage from '@/components/Loading';

interface HOCProps {}

function withHOC<T extends object>(
  WrappedComponent: ComponentType<T>
): FC<T & HOCProps> {
  return function WithHOC(props: T & HOCProps) {
    const { authLoading, auth } = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    useEffect(() => {
      if (!authLoading && auth) {
        router.push('/').then((r) => {});
      }
    }, [auth, authLoading]);

    return (
      <>
        {authLoading ? (
          <LoadingPage floating={false} />
        ) : (
          <WrappedComponent {...props} />
        )}
      </>
    );
  };
}

export default withHOC;
