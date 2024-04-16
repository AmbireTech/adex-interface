module.exports = {
  extends: ['plugin:react/recommended', 'airbnb', 'prettier', 'airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  env: {
    browser: true,
    es2021: true
  },
  parser: '@typescript-eslint/parser',
  plugins: ['react', 'react-hooks', 'prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        useTabs: false,
        endOfLine: 'auto'
      }
    ],
    'no-console': 'off', // TEMP
    'func-names': 0,
    'prefer-destructuring': 0,
    '@typescript-eslint/semi': 'off',
    'react/style-prop-object': 'off',
    'react/function-component-definition': 'off',
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'consistent-return': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-extra-semi': 'off',
    'no-plusplus': 'off',
    '@typescript-eslint/indent': 'off',
    'react/no-unstable-nested-components': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx', '.tsx'] }],
    'import/no-relative-parent-imports': 'error',
    'no-return-await': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'import/no-relative-parent-imports': 'off',
    'jsx-a11y/label-has-associated-control': [
      2,
      {
        assert: 'either',
        depth: 3
      }
    ]
  }
}
