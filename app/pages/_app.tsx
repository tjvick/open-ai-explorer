import '@/styles/globals.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <React.Fragment>
    <CssBaseline />
    <Component {...pageProps} />
  </React.Fragment>
}
