import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import sveltePlugin from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import * as espree from 'espree';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...sveltePlugin.configs['flat/prettier'],
  eslintConfigPrettier,
  { languageOptions: { globals: globals.browser } },
  { files: ['**/*.{js,mjs,cjs,ts,svelte}'] },
  {
    files: ['**/*webpack*.js'],
    languageOptions: { globals: globals.node, sourceType: 'commonjs' },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/*.svelte', '*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: {
          ts: tseslint.parser,
          js: espree,
          typescript: tseslint.parser,
        },
      },
    },
  },
  {
    // Custom rules
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      'dot-notation': 'off',
      'no-plusplus': 'off',
      'import/extensions': 'off',
      'import/prefer-default-export': 'off',
      'no-continue': 'off',
      'no-restricted-syntax': 'off',
      'no-underscore-dangle': 'off',
      'max-len': ['error', { code: 140 }],
      'max-lines-per-function': ['error', 250],
      'max-params': ['error', 8],
      'prefer-destructuring': 'off',
      'sort-imports': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      'no-var': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-empty': 'off',
    },
  },
];
