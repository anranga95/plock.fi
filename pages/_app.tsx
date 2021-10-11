import '@celo-tools/use-contractkit/lib/styles.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Plock</title>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="utf-8" />
        <meta name="keywords" content="celo, cryptocurrency, defi" />
        <meta
          name="description"
          content="Access to the decentralised world of Celo"
        />

        <link rel="manifest" href="/manifest.json" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />

        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-touch-icon-152x152.png"></link>
        <link rel="apple-touch-icon" sizes="180x180"href="/icons/apple-touch-icon-150x180.png"></link>
          
        <script async src="/dark-mode.js" />
      </Head>

      <div suppressHydrationWarning>
        {typeof window === 'undefined' ? null : <Component {...pageProps} />}
      </div>
    </>
  );
}