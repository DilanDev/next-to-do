import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import { NotificationProvider } from '../context/NotificationContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NotificationProvider>
      <Component {...pageProps} />
    </NotificationProvider>
  );
}