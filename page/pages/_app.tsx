import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return <div>
    <Head>
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
    </Head>
    <Component {...pageProps} />
  </div>
}
