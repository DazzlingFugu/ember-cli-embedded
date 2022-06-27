import Application from '@ember/application'

import { initialize } from 'dummy/initializers/embedded'
import { module, test } from 'qunit'
import Resolver from 'ember-resolver'
import { run } from '@ember/runloop'

import type { TestContext } from '@ember/test-helpers'

type TestApplication = TestContext['owner'] & {
  // Public types are currently incomplete, these 2 properties exist:
  // https://github.com/emberjs/ember.js/blob/v3.26.1/packages/@ember/application/lib/application.js#L376-L377
  _booted: boolean
  _readinessDeferrals: number
}

// How an app would look like with our Initializer `embedded`
interface EmbeddedApp extends TestApplication {
  start?: (config?: Record<string, unknown>) => void
}

interface Context {
  TestApplication: typeof Application
  application: EmbeddedApp
}

module('Unit | Initializer | embedded', function (hooks) {
  hooks.beforeEach(function (this: Context) {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = 'something_random'
    }

    this.TestApplication.initializer({
      name: 'initializer under test',
      initialize,
    })

    // @ts-ignore: temporarily required as public types are incomplete
    this.application = this.TestApplication.create({
      autoboot: false,
      Resolver,
    })

    this.application.register('config:environment', {})
  })

  hooks.afterEach(function (this: Context) {
    run(this.application, 'destroy')
  })

  test('by default, it does not change the normal behaviour', async function (this: Context, assert) {
    await this.application.boot()

    assert.strictEqual(
      this.application.start,
      undefined,
      'No `start()` method has been added'
    )

    assert.deepEqual(
      this.application.resolveRegistration('config:embedded'),
      {},
      'An empty embedded config is registered'
    )

    assert.true(this.application._booted, 'The app has booted')

    assert.strictEqual(
      this.application._readinessDeferrals,
      0,
      'No deferral has been added'
    )
  })

  test('without `delegateStart`, it does not change the normal behaviour', async function (this: Context, assert) {
    this.application.register('config:environment', {
      embedded: {
        delegateStart: false,
      },
    })

    await this.application.boot()

    assert.strictEqual(
      this.application.start,
      undefined,
      'No `start()` method has been added'
    )

    assert.deepEqual(
      this.application.resolveRegistration('config:embedded'),
      {},
      'An empty embedded config is registered'
    )

    assert.true(this.application._booted, 'The app has booted')

    assert.strictEqual(
      this.application._readinessDeferrals,
      0,
      'No deferral has been added'
    )
  })

  test('without `delegateStart`, the specified config is registered', async function (this: Context, assert) {
    const myCustomConfig = {
      donald: 'duck',
    }

    this.application.register('config:environment', {
      embedded: {
        delegateStart: false,
        config: myCustomConfig,
      },
    })

    await this.application.boot()

    assert.deepEqual(
      this.application.resolveRegistration('config:embedded'),
      myCustomConfig,
      'The embedded config matches the custom config'
    )
  })

  test('with `delegateStart`, it defers the boot of the app', function (this: Context, assert) {
    this.application.register('config:environment', {
      embedded: {
        delegateStart: true,
      },
    })

    const { _readinessDeferrals: initialDeferrals } = this.application

    /**
     * Cannot use `application.boot()` here as this would imply triggering the readiness deferral
     * and the resulting promise (of the boot) would never resolve.
     */
    initialize(this.application)

    assert.strictEqual(
      typeof this.application.start,
      'function',
      'A `start()` method has been added'
    )

    assert.false(this.application._booted, 'The app has not booted')

    assert.strictEqual(
      this.application._readinessDeferrals,
      initialDeferrals + 1,
      'A deferral has been added'
    )
  })

  test('with `delegateStart`, the passed config is not registered until the app is started', function (this: Context, assert) {
    const myCustomConfig = {
      donald: 'duck',
    }

    this.application.register('config:environment', {
      embedded: {
        delegateStart: true,
        config: myCustomConfig,
      },
    })

    /**
     * Cannot use `application.boot()` here as this would imply triggering the readiness deferral
     * and the resulting promise (of the boot) would never resolve.
     */
    initialize(this.application)

    assert.deepEqual(
      this.application.resolveRegistration('config:embedded'),
      undefined,
      'The embedded config is not registered until the app is started'
    )
  })

  test('at manual boot, the passed config is merged into the embedded config', function (this: Context, assert) {
    const myCustomConfig = {
      yo: 'my config',
      hey: 'sup?',
    }

    this.application.register('config:environment', {
      embedded: {
        delegateStart: true,
        config: myCustomConfig,
      },
    })

    /**
     * Cannot use `application.boot()` here as this would imply triggering the readiness deferral
     * and the resulting promise (of the boot) would never resolve.
     */
    initialize(this.application)

    this.application.start?.({
      yay: 'one more',
      yo: 'new config',
    })

    assert.deepEqual(
      this.application.resolveRegistration('config:embedded'),
      {
        yo: 'new config',
        hey: 'sup?',
        yay: 'one more',
      },
      'The passed start config is melded into the embedded config'
    )
  })

  test('at manual boot, one deferral is removed', function (this: Context, assert) {
    this.application.register('config:environment', {
      embedded: {
        delegateStart: true,
      },
    })

    /**
     * Cannot use `application.boot()` here as this would imply triggering the readiness deferral
     * and the resulting promise (of the boot) would never resolve.
     */
    initialize(this.application)

    const { _readinessDeferrals: initialDeferrals } = this.application

    this.application.start?.()

    assert.strictEqual(
      this.application._readinessDeferrals,
      initialDeferrals - 1,
      'A deferral has been removed'
    )
  })
})
