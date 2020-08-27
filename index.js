'use strict'

module.exports = {
  name: 'ember-cli-embedded',
  config: function (env, config) {
    if (!config.embedded || !this.app) {
      return
    }

    // As the app will be embedded, we should not make any assumptions
    // regarding the execution context (aka index.html) and therefore
    // (try to) make sure that the app can be deployed to any page,
    // therefore move the config anywhere but in the meta tag.
    this.app.options.storeConfigInMeta = false
  }
}
