import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import type { TSESLint } from '@typescript-eslint/utils';

import pluginReact from 'eslint-plugin-react';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import css from '@eslint/css';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

const ignores = [
  'dist/**/*',
  'build/**/*',
  'node_modules/**/*',
  '**/*.d.ts',
  '**/*.d.ts.map',
  '**/*.js.map',
];

const config: TSESLint.FlatConfig.ConfigArray = tseslint.config([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: [js.configs.recommended],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    ignores,
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: [json.configs.recommended],
    ignores,
  },
  {
    files: ['**/*.md'],
    plugins: { markdown },
    language: 'markdown/gfm',
    extends: [markdown.configs.recommended],
    ignores,
  },
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: [css.configs.recommended],
    ignores,
  },
  prettierConfig,
  prettierPlugin,
]);

export default config;
