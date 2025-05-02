// eslint.config.ts
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Ignore dist folder
  { ignores: ['dist'] },

  {
    files: ['**/*.{ts,tsx}'], // Apply to TypeScript files
    extends: [
      js.configs.recommended,           // Base JS rules
      ...tseslint.configs.recommended,  // TS plugin recommended rules
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser, // e.g., window, document, etc.
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Optional: you might want to enable this later
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
