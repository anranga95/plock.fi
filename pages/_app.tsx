import '@celo-tools/use-contractkit/lib/styles.css';
import { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Plock</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content="celo, cryptocurrency, defi" />
        <meta
          name="description"
          content="Access to the decentralised world of Celo"
        />

          <meta name='application-name' content='Plock.fi' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='Plock.fi' />
          <meta name='description' content='Gateway to Defi on Celo' />
          <meta name='format-detection' content='telephone=no' />
          <meta name='mobile-web-app-capable' content='yes' />
          <link rel='apple-touch-icon' sizes='180x180' href='/icons/apple-touch-icon.png' />
          <link rel='manifest' href='/manifest.json' />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="/icons/favicon-16x16.png" rel="icon" type="image/png" sizes="16x16" />
        <link href="/icons/favicon-32x32.png" rel="icon" type="image/png" sizes="32x32" />

        <script async src="/dark-mode.js" />

        {process.browser && (
          <>
            <script
              async
              defer
              data-domain="app.plock.fi"
              src="https://stats.app.plock.fi/js/index.js"
            />
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }',
              }}
            ></script>
          </>
        )}
      </Head>

      <div suppressHydrationWarning>
        {typeof window === 'undefined' ? null : <Component {...pageProps} />}
      </div>
    </>
  );
}

export default MyApp;
