import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from 'typescript-eslint'

import pluginEmber from 'eslint-plugin-ember'
import pluginEmberRecommended from 'eslint-plugin-ember/configs/recommended'
import pluginEslintJs from '@eslint/js'
import pluginNode from 'eslint-plugin-n'
import pluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: pluginEslintJs.configs.recommended,
  allConfig: pluginEslintJs.configs.all,
})

export default tseslint.config(
  pluginEslintJs.configs.recommended,
  // @ts-expect-error: See https://github.com/ember-tooling/ember-eslint-parser/issues/113
  ...pluginEmberRecommended,
  pluginPrettierRecommended,

  {
    ignores: [
      // Unconventional js
      'blueprints/*/files/',

      // Compiled output
      'dist/',

      // Misc
      'coverage/',
      '!**/.*',
      '**/.*/',

      // ember -try
      '.node_modules.ember-try/',
      'npm-shrinkwrap.json.ember-try',
      'package.json.ember-try',
      'package-lock.json.ember-try',
      'yarn.lock.ember-try',
    ],
  },
  {
    plugins: {
      ember: pluginEmber,
      '@typescript-eslint': tseslint.plugin,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tseslint.parser,
      ecmaVersion: 'latest',
      sourceType: 'script',
    },

    rules: {
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          minimumDescriptionLength: 7,
        },
      ],

      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': ['error'],
    },
  },
  ...compat
    .extends(
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
    })),
  {
    files: ['**/*.ts'],
    rules: {},
  },
  {
    // Config for Node files

    ...pluginNode.configs['flat/recommended-script'],

    files: [
      '.prettierrc.js',
      '.stylelintrc.js',
      '.template-lintrc.js',
      'ember-cli-build.js',
      'eslint.config.mjs',
      'index.js',
      'testem.js',
      'blueprints/*/index.js',
      'config/**/*.js',
      'tests/dummy/config/**/*.js',
    ],

    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
        ...globals.node,
      },
    },
  },
  ...compat.extends('plugin:qunit/recommended').map((config) => ({
    ...config,
    files: ['tests/**/*-test.{js,ts}'],
  })),
  {
    files: ['**/*.ts'],

    rules: {
      '@typescript-eslint/explicit-module-boundary-types': ['error'],
    },
  },
  {
    files: ['**/*.ts'],

    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
    },
  },
)
