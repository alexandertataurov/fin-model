module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'unused-imports'],
  rules: {
    // React-specific rules
    'react-refresh/only-export-components': 'off',

    // TypeScript rules - relaxed for production flexibility
    // Prefer plugin to remove unused imports automatically
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off', // Allow any without warning
    '@typescript-eslint/ban-ts-comment': 'warn', // Allow @ts-ignore but warn
    '@typescript-eslint/no-non-null-assertion': 'off',

    // Code quality rules
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // React hooks rules - relaxed for advanced patterns
    'react-hooks/exhaustive-deps': 'warn', // Performance optimization patterns
  },
};
