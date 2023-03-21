import '../styles/globals.scss';
import '../styles/commons.scss';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from 'next-themes';
import DarkModeProvider from '../contexts/DarkModeProvider';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>Chat App</title>
    </Head>
    <ThemeProvider attribute={'class'} defaultTheme={'light'}>
      <Provider store={store}>
        <DarkModeProvider>
          <Component {...pageProps} />
        </DarkModeProvider>
      </Provider>
    </ThemeProvider>
  </>;
}
