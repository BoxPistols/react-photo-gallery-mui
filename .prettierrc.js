module.exports = {
  // 基本設定
  semi: false, // セミコロンなし
  singleQuote: true, // シングルクォート
  trailingComma: 'es5', // ES5準拠の末尾カンマ
  tabWidth: 2, // インデント幅
  useTabs: false, // スペースを使用
  printWidth: 80, // 行の長さ制限

  // JavaScript/TypeScript設定
  arrowParens: 'always', // アロー関数の括弧
  bracketSpacing: true, // オブジェクトの括弧内スペース
  bracketSameLine: false, // JSXの終了括弧を新しい行に

  // JSX設定
  jsxSingleQuote: false, // JSXではダブルクォート

  // その他
  endOfLine: 'lf', // 改行コード
  quoteProps: 'as-needed', // プロパティのクォート
  embeddedLanguageFormatting: 'auto', // 埋め込み言語のフォーマット

  // プラグイン
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss',
  ],

  // Import並び替え設定
  importOrder: [
    '^react$',
    '^react-dom$',
    '^next',
    '<THIRD_PARTY_MODULES>',
    '^@/(.*)$',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  // ファイル固有設定
  overrides: [
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
      },
    },
    {
      files: '*.json',
      options: {
        printWidth: 120,
      },
    },
    {
      files: '*.yml',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
}
