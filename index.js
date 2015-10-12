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

    // As the app will be embedded, we should not make any assumptions
    // regarding the execution context (aka index.html) and therefore
    // (try to) make sure that the app can be deployed to any page,
    // therefore move the config anywhere but in the meta tag.
    this.app.options.storeConfigInMeta = false;
  }
};
