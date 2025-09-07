import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  ...compat.plugins('storybook'),
  {
    rules: {
      // TypeScript Rules - 厳しすぎない程度に設定
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // 型情報が必要なルールを無効化
      '@typescript-eslint/prefer-optional-chain': 'off', // 型情報が必要なルールを無効化
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // JavaScript Rules
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // React Rules
      'react-hooks/exhaustive-deps': 'error',
      'react/no-unescaped-entities': 'off', // Next.js handles this
      'react/prop-types': 'off', // TypeScriptで型チェック済み
      'react/react-in-jsx-scope': 'off', // React 17+では不要
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',

      // Next.js Rules
      '@next/next/no-img-element': 'warn', // 警告レベル（最適化推奨）
      '@next/next/no-page-custom-font': 'off', // App Routerでは適用外

      // Import Rules
      'import/no-duplicates': 'error',
      'import/no-anonymous-default-export': 'off',
      'import/no-anonymous-default-export': 'off',

      // General Code Quality
      'no-shadow': 'off', // TypeScript版を使用
      '@typescript-eslint/no-shadow': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-else-return': 'error',
      'no-nested-ternary': 'warn',

      // Accessibility - 厳しすぎない設定
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',

      // Storybook Rules
      'storybook/hierarchy-separator': 'error',
      'storybook/default-exports': 'error',
    },
  },
  {
    // TypeScript専用ファイル設定
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  {
    // Test files専用設定
    files: ['**/*.test.{js,jsx,ts,tsx}', '**/*.spec.{js,jsx,ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    // Storybook files専用設定
    files: ['**/*.stories.{js,jsx,ts,tsx}', '**/.storybook/**'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      'storybook/prefer-pascal-case': 'error',
    },
  },
  {
    ignores: [
      'dist/**/*',
      '.next/**/*',
      'node_modules/**/*',
      'coverage/**/*',
      'storybook-static/**/*',
      '*.d.ts',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      '.storybook/main.ts',
      '.prettierrc.js',
      'public/**/*',
      'pnpm-lock.yaml',
    ],
  },
]

export default eslintConfig
