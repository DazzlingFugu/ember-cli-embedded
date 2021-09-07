/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

const getChannelURL = require('ember-source-channel-url')
const { embroiderSafe, embroiderOptimized } = require('@embroider/test-setup')

module.exports = async function () {
  return {
    useYarn: true,
    scenarios: [
      {
        name: 'lts-3.20',
        npm: {
          devDependencies: {
            'ember-source': '~3.20.5',
          },
        },
      },
      {
        name: 'lts-3.24',
        npm: {
          devDependencies: {
            'ember-source': '~3.24.3',
          },
        },
      },
      {
        name: 'release',
        npm: {
          devDependencies: {
            'ember-source': await getChannelURL('release'),
          },
        },
      },
      // The default `.travis.yml` runs this scenario via `npm test`,
      // not via `ember try`. It's still included here so that running
      // `ember try:each` manually or from a customized CI config will run it
      // along with all the other scenarios.
      {
        name: 'default',
        npm: {
          devDependencies: {},
        },
      },
      {
        name: 'default-with-jquery',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'jquery-integration': true,
          }),
        },
        npm: {
          devDependencies: {
            '@ember/jquery': '^1.1.0',
          },
        },
      },
      {
        name: 'classic',
        env: {
          EMBER_OPTIONAL_FEATURES: JSON.stringify({
            'application-template-wrapper': true,
            'default-async-observers': false,
            'template-only-glimmer-components': false,
          }),
        },
        npm: {
          ember: {
            edition: 'classic',
          },
        },
      },
      embroiderSafe(),
      embroiderOptimized(),
    ],
  }
}
