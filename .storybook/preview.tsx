import { CssBaseline, ThemeProvider } from '@mui/material'
import type { Preview } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { theme } from '../src/lib/theme'
import '../src/app/globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div style={{ padding: '1rem' }}>
            <Story />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    ),
  ],
}

export default preview
