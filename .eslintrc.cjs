module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  extends: ['eslint:recommended', 'plugin:svelte/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['svelte', '@typescript-eslint'],
  settings: {
    'svelte3/typescript': () => require('typescript'),
    'svelte3/ignore-styles': () => true
  },
  overrides: [
    {
      files: ['**/*.svelte'],
      processor: 'svelte3/svelte3'
    }
  ],
  env: {
    browser: true,
    es2021: true
  },
  rules: {}
};
