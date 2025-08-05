/** @import { Config } from "prettier" */

/** @type {Config} */
export default {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  tabWidth: 2,
  importOrder: [
    '^@?(.*)$',
    '<BUILTIN_MODULES>',
    '<THIRD_PARTY_MODULES>',
    ' ',
    ' ',
    '^[./]',
    '^[../]',
  ],
  importOrderParserPlugins: ['typescript', 'jsx'],
  plugins: [
    'prettier-plugin-tailwindcss',
    '@ianvs/prettier-plugin-sort-imports',
  ],
};
