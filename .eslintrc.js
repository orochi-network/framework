export default {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:import/typescript', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  ignores: ['build/', 'node_modules/', 'devel.js'],
  plugins: ['@typescript-eslint'],
  rules: {
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'class-methods-use-this': [1],
    'no-underscore-dangle': [0],
    'import/no-unresolved': [1],
    '@typescript-eslint/no-unused-vars': [
      2,
      {
        args: 'all',
        argsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    camelcase: 2,
    'arrow-body-style': 0,
    'no-mixed-spaces-and-tabs': 2,
    'max-len': [
      2,
      {
        code: 120,
        tabWidth: 2,
        ignoreUrls: true,
      },
    ],
  },
};
