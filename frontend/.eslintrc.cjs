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
  plugins: ['react-refresh', '@typescript-eslint'],
  rules: {
    // React-specific rules
    'react-refresh/only-export-components': 'warn',

    // TypeScript rules - relaxed for production flexibility
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn', // Allow any but warn
    '@typescript-eslint/ban-ts-comment': 'warn', // Allow @ts-ignore but warn

    // Code quality rules
    'prefer-const': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // React hooks rules - relaxed for advanced patterns
    'react-hooks/exhaustive-deps': 'warn', // Performance optimization patterns
  },
};
