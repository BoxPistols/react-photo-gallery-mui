'use client'

import createCache from '@emotion/cache'

const isBrowser = typeof document !== 'undefined'

// Emotion cache configuration for better performance
export function createEmotionCache() {
  let insertionPoint: HTMLElement | undefined

  if (isBrowser) {
    // Create a meta tag for emotion styles insertion point
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    )
    insertionPoint = emotionInsertionPoint ?? undefined
  }

  return createCache({
    key: 'emotion',
    insertionPoint,
    // Speed up emotion by prepending styles
    prepend: true,
    // Enable source maps in development
    ...(process.env.NODE_ENV === 'development' && {
      nonce: undefined,
      speedy: false,
    }),
  })
}

// Default cache instance
export const emotionCache = createEmotionCache()

// Default export for Storybook compatibility
export default createEmotionCache
