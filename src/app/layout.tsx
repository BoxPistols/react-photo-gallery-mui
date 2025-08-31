'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import { Inter } from 'next/font/google'
import type { ReactNode } from 'react'

import { QueryProvider } from '@/lib/query-provider'
import { theme } from '@/lib/theme'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

/**
 * for emotion & mui
 */
const cache = createCache({
  key: 'emotion',
  prepend: true,
  stylisPlugins: [],
})

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ja" className={inter.variable}>
      <head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1976d2" />
      </head>
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <CacheProvider value={cache}>
            <MuiThemeProvider theme={theme}>
              <CssBaseline />
              <QueryProvider>{children}</QueryProvider>
            </MuiThemeProvider>
          </CacheProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
