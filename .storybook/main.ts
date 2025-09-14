import { resolve } from 'path'
import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
  viteFinal: async (config) => {
    // Ensure path aliases work
    if (!config.resolve) {
      config.resolve = {}
    }
    if (!config.resolve.alias) {
      config.resolve.alias = {}
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, '../src'),
    }

    // Ensure React is available globally
    if (!config.define) {
      config.define = {}
    }
    config.define.global = 'globalThis'

    // Suppress "use client" directive warnings during bundling
    if (!config.build) {
      config.build = {}
    }
    if (!config.build.rollupOptions) {
      config.build.rollupOptions = {}
    }
    if (!config.build.rollupOptions.onLog) {
      config.build.rollupOptions.onLog = (level, log, handler) => {
        // Suppress "use client" directive warnings
        if (
          log.message?.includes(
            'Module level directives cause errors when bundled'
          )
        ) {
          return
        }
        // Suppress sourcemap warnings for "use client" files
        if (
          log.message?.includes(
            "Error when using sourcemap for reporting an error: Can't resolve original location"
          )
        ) {
          return
        }
        handler(level, log)
      }
    }

    // Improve build performance and reduce warnings
    config.build.sourcemap = false

    return config
  },
}

export default config
