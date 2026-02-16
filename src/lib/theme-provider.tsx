'use client'

import { CssBaseline, useMediaQuery } from '@mui/material'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { useMemo, type ReactNode } from 'react'

import { lightTheme, darkTheme } from './theme'

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = useMemo(
    () => (prefersDark ? darkTheme : lightTheme),
    [prefersDark]
  )

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
