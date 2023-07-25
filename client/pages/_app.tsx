import { store } from '@/redux/store';
import '@/styles/commons.scss';
import '@/styles/font.scss';
import '@/styles/globals.scss';
import 'react-loading-skeleton/dist/skeleton.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import AuthProvider from '../contexts/AuthContext';
import DarkModeProvider from '../contexts/DarkModeProvider';
import SocketProvider from "../contexts/SocketContext";
import GlobalLayout from "@/layouts/GlobalLayout";
import {useEffect} from 'react'

const PeerProvider = dynamic(() => import("contexts/PeerContext"), { ssr: false })

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      getNextPageParam: ({ data }: any) => data.meta.nextPage,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <>
      <Head>
        <title>MeloChat</title>
      </Head>
      <ThemeProvider attribute={'class'} defaultTheme={'light'}>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ''}>
            <Provider store={store}>
              <AuthProvider>
                <DarkModeProvider>
                  <SocketProvider>
                    <PeerProvider>
                      <GlobalLayout>
                        <Component {...pageProps} />
                      </GlobalLayout>
                    </PeerProvider>
                  </SocketProvider>
                </DarkModeProvider>
              </AuthProvider>
            </Provider>
            <Toaster
              gutter={8}
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3000,
              }}
            />
          </GoogleOAuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </>
  );
}
