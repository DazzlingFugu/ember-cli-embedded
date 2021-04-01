import { run } from '@ember/runloop'
import { initialize } from '../../../instance-initializers/embedded'
import Application from '@ember/application'
import { module, skip } from 'qunit'

module('Unit | Instance Initializer | embedded', function(hooks) {
  hooks.beforeEach(function() {
    run(() => {
      this.application = Application.create()
      this.application.setupForTesting()
      this.application.injectTestHelpers()
      this.appInstance = this.application.buildInstance()
    })
  })

  hooks.afterEach(function() {
    run(this.appInstance, 'destroy')
  })

  skip('It works without config', function(assert) {
    this.application.register('config:environment', { APP: {}, embedded: true }, { instantiate: false })
    initialize(this.appInstance)

    assert.ok(true, 'it does not break')
  })

  skip('It merges the embedded config back to the App Config', function(assert) {
    this.application.register('config:environment', { APP: {}, embedded: true }, { instantiate: false })
    this.application.register('config:embedded', { yoKey: 'Yo Value!' }, { instantiate: false })
    initialize(this.appInstance)

    assert.equal(this.appInstance.resolveRegistration('config:environment').APP.yoKey, 'Yo Value!')
  })
})
