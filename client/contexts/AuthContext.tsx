import React, { createContext, useState } from 'react';
import { useQuery } from 'react-query';
import {removeToken, useGetMeApi} from '@/service/AuthService';

export type AuthContextType = {
  auth: UserType | null;
  removeAuth: () => void;
  authLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

interface IAuthProvider {
  children: React.ReactNode;
}

const AuthProvider: React.FC<IAuthProvider> = ({ children }) => {
  const [auth, setAuth] = useState<UserType | null>(null);
  const { isLoading: authLoading } = useGetMeApi({
    onSuccess: ({ data }: { data: UserType }) => {
      setAuth(data);
    },
  });

  const removeAuth = () => {
    removeToken()
    setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ auth, authLoading, removeAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
