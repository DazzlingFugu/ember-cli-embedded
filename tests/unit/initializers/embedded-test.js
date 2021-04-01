import Application from '@ember/application'

import { initialize } from 'dummy/initializers/embedded'
import { module, skip } from 'qunit'
import { setupTest } from 'ember-qunit'
import { run } from '@ember/runloop'

module('Unit | Initializer | embedded', function(hooks) {
  setupTest(hooks)

  hooks.beforeEach(function() {
    this.TestApplication = Application.extend()
    this.application = this.TestApplication.create({ autoboot: false })
    this.application.register('config:environment', {})
  })

  hooks.afterEach(function() {
    run(this.application, 'destroy')
  })

  skip('by default, it does not change the normal behaviour', function(assert) {
    const { _readinessDeferrals: initialDeferrals } = this.application
    initialize(this.application)
    assert.notOk(this.application.start, 'no method has been added')
    assert.deepEqual(this.application.resolveRegistration('config:embedded'), {}, 'an empty config is registered')
    assert.equal(this.application._readinessDeferrals, initialDeferrals, 'no deferral has been added')
  })

  skip('without delegateStart, it does not change the normal behaviour', function(assert) {
    this.application.register('config:environment', {
      embedded: {
        delegateStart: false
      }
    })
    const { _readinessDeferrals: initialDeferrals } = this.application
    initialize(this.application)
    assert.notOk(this.application.start, 'no method has been added')
    assert.deepEqual(this.application.resolveRegistration('config:embedded'), {}, 'an empty config is registered')
    assert.equal(this.application._readinessDeferrals, initialDeferrals, 'no deferral has been added')
  })

  skip('without delegateStart, the specified config is registered', function(assert) {
    let config = {}
    this.application.register('config:environment', {
      embedded: {
        delegateStart: false,
        config
      }
    })
    initialize(this.application)
    assert.deepEqual(this.application.resolveRegistration('config:embedded'), config, 'an empty config is registered')
  })

  skip('with delegateStart, it defers the bootstrap of the app', function(assert) {
    this.application.register('config:environment', {
      embedded: {
        delegateStart: true
      }
    })
    const { _readinessDeferrals: initialDeferrals } = this.application
    initialize(this.application)
    assert.ok(this.application.start, 'The start method has been added')
    assert.notOk(this.application.resolveRegistration('config:embedded'), 'the config is not registered until the app is started')
    assert.equal(this.application._readinessDeferrals, initialDeferrals + 1, 'a deferral has been added')
  })

  skip('with delegateStart, the specified config is still not registered until the app starts', function(assert) {
    let config = {}
    this.application.register('config:environment', {
      embedded: {
        delegateStart: true,
        config
      }
    })
    initialize(this.application)
    assert.notOk(this.application.resolveRegistration('config:embedded'), 'no config is registered, the app is not started')
  })

  skip('at manual bootstrap, the config is merged with the provided one', function(assert) {
    let config = { yo: 'my config', hey: 'sup?' }
    this.application.register('config:environment', {
      embedded: {
        delegateStart: true,
        config
      }
    })
    initialize(this.application)
    this.application.start({ yay: 'one more', yo: 'new config' })
    const embeddedConfig = this.application.resolveRegistration('config:embedded')
    assert.equal(embeddedConfig.yo, 'new config', 'passed config overrides default config')
    assert.equal(embeddedConfig.yay, 'one more', 'default keys are preserved unless overridden')
    assert.equal(embeddedConfig.hey, 'sup?', 'new keys are injected')
  })

  skip('at manual bootstrap, one deferral is removed', function(assert) {
    this.application.register('config:environment', {
      embedded: {
        delegateStart: true
      }
    })
    initialize(this.application)
    const { _readinessDeferrals: initialDeferrals } = this.application
    this.application.start()
    assert.equal(this.application._readinessDeferrals, initialDeferrals - 1, 'a deferral has been removed')
  })
})
