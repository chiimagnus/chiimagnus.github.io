module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  ignorePatterns: ['dist/', 'node_modules/', '.github/', 'public/models/'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react-hooks', 'react-refresh'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  rules: {
    // 现有代码中允许 `any`（例如外部 API 响应/不受控数据）。
    '@typescript-eslint/no-explicit-any': 'off',
    // `npm run lint` 使用 `--max-warnings 0`，这里关闭该规则避免阻断工作流。
    'react-refresh/only-export-components': 'off',
  },
};
