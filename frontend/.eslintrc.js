module.exports = {
    env: {
      browser: true,
      es2021: true,
      node: true,
      jest: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:jsx-a11y/recommended',
      'next'
    ],
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    plugins: [
      'react',
      'jsx-a11y' 
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Warning-only rules - these won't fail the build
      'react/prop-types': 'warn',
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      
      // Accessibility rules as warnings
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      
      // Ignore certain patterns
      'react/react-in-jsx-scope': 'off',
    },
    ignorePatterns: ['build/**', 'dist/**', 'node_modules/**', '**/*.test.js'],
  };