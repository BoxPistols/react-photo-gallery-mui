import type { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
  ],
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
      '@': '/Users/ai/client/KSD/UI/react-photoswipe-gallery-mui/src',
    }
    
    // Ensure React is available globally
    if (!config.define) {
      config.define = {}
    }
    config.define.global = 'globalThis'
    
    return config
  },
}

export default config