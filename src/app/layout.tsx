'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import type { ReactNode } from 'react'

import { QueryProvider } from '@/lib/query-provider'
import { theme } from '@/lib/theme'
import './globals.css'

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
    <html lang="ja">
      <head>
        <meta name="emotion-insertion-point" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#1976d2" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily:
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        }}
      >
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
