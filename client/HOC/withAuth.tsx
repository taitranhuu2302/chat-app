import { ComponentType, FC, useContext, useEffect } from 'react';
import LoadingPage from '@/components/Loading';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import { useRouter } from 'next/router';

interface HOCProps {}

function withHOC<T extends object>(
  WrappedComponent: ComponentType<T>
): FC<T & HOCProps> {
  return function WithHOC(props: T & HOCProps) {
    const { authLoading, auth } = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    useEffect(() => {
      if (!authLoading && !auth) {
        router.push('/auth').then(() => {});
      }
    }, [auth, authLoading]);

    return (
      <>
        {authLoading && !auth ? (
          <LoadingPage floating={false} />
        ) : (
          <WrappedComponent {...props} />
        )}
      </>
    );
  };
}

export default withHOC;
