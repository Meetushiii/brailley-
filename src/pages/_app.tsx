import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { AudioProvider } from '@/context/AudioContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AudioProvider>
      <Component {...pageProps} />
    </AudioProvider>
  )
} 