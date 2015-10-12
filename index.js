/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-embedded',
  config: function (env, config) {
    config.embedded = config.embedded || false;
    if (!config.embedded || !this.app) {
      return;
    }

    // Transforms into an object for better control
    if (config.embedded === true) {
      config.embedded = {};
    }

    console.warn('[ember-cli-embedded] the `name` property has been deprecated, ' +
                  'to change the name of the exposed application, ' +
                  'use config.exportApplicationGlobal instead.',
                  Object.keys(config).indexOf('name') !== -1);
    delete config.name;
  }
};
