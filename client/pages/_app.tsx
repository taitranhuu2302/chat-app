import '@/styles/globals.scss';
import '@/styles/commons.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from 'next-themes';
import DarkModeProvider from '../contexts/DarkModeProvider';
import Head from 'next/head';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Chat App</title>
      </Head>
      <ThemeProvider attribute={'class'} defaultTheme={'light'}>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID || ''}>
            <Provider store={store}>
              <DarkModeProvider>
                <Component {...pageProps} />
              </DarkModeProvider>
            </Provider>
            <Toaster
              gutter={8}
              position="bottom-right"
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
