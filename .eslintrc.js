'use strict'

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
  },
  plugins: [
    'ember',
    '@typescript-eslint',
  ],
  extends: [
    'eslint:recommended',
    'plugin:ember/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  env: {
    browser: true,
  },
  rules: {
    // --- TypeScript rules

    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-check': 'allow-with-description',
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        /**
         * Count 2 characters for `: ` when giving a description.
         *
         * @ts-nocheck: a
         *            ^^^--- Description of 3 characters
         *
         * @ts-nocheck: abc
         *            ^^^^^--- Description of 5 characters
         */
        minimumDescriptionLength: 7, // minimum of 2 + 5
      },
    ],

    // This rule is overriden and configured in the `overrides` Array below
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['error'],
  },
  overrides: [
    // node files
    {
      files: [
        './.eslintrc.js',
        './.prettierrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './index.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './tests/dummy/config/**/*.js',
      ],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['node'],
      extends: ['plugin:node/recommended'],
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },

    // TypeScript related

    {
      // enable the rule specifically for TypeScript files
      files: ['*.ts'],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': ['error'],
      },
    },

    {
      files: ['**/*.ts'],
      rules: {
        // These 2 rules are already covered by the TypeScript compiler (`tsc`)
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
        'no-unused-vars': 'off',
      },
    },
  ],
}
