import Application from '@ember/application'
import { initialize } from 'dummy/initializers/export-application-global'
import { module, test } from 'qunit'
import Resolver from 'ember-resolver'
import { classify } from '@ember/string'
import { run } from '@ember/runloop'

import type AppConfig from 'dummy/config/environment'

type TestApplication = Application & {
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

module('Unit | Initializer | export-application-global', function (hooks) {
  hooks.beforeEach(function (this: Context) {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = 'whatever'
    }

    this.TestApplication.initializer({
      name: 'export application global initializer',
      initialize,
    })

    // @ts-expect-error: Temporarily required as public types are incomplete
    this.application = this.TestApplication.create({
      autoboot: false,
      Resolver,
    })

    this.application.register('config:environment', {})
  })

  hooks.afterEach(function (this: Context) {
    const config = this.application.resolveRegistration('config:environment') as typeof AppConfig
    const exportedApplicationGlobal = classify(config.modulePrefix)

    // @ts-expect-error: No index signature for Window
    delete window[exportedApplicationGlobal]

    run(this.application, 'destroy')
  })

  const testCases = [
    ['something-random', 'SomethingRandom'],
    ['something_more-random', 'SomethingMoreRandom'],
    ['something-', 'Something'],
    ['something', 'Something'],
  ] as const

  testCases.forEach((testData) => {
    test('it adds expected application global to window if `config.embedded.delegateStart` is `true`', async function (this: Context, assert) {
      const [modulePrefix, exportedApplicationGlobal] = testData

      this.application.register('config:environment', {
        modulePrefix,
        embedded: {
          delegateStart: true,
        },
      })

      await this.application.boot()

      assert.strictEqual(
        classify(modulePrefix),
        exportedApplicationGlobal,
        'it "classifies" module prefix',
      )

      assert.deepEqual(
        // @ts-expect-error: No index signature for Window
        window[exportedApplicationGlobal],
        this.application,
        'it creates expected application global on window',
      )
    })
  })

  test('it does not add application global to window if config.embedded.delegateStart is not true', async function (this: Context, assert) {
    this.application.register('config:environment', {
      modulePrefix: 'something-random',
    })

    await this.application.boot()

    // @ts-expect-error: No index signature for Window
    assert.notOk(window.SomethingRandom)
  })

  test('it does not create application global on window if config.exportApplicationGlobal is false', async function (this: Context, assert) {
    this.application.register('config:environment', {
      modulePrefix: 'something-random',
      embedded: {
        delegateStart: true,
      },
      exportApplicationGlobal: false,
    })

    await this.application.boot()

    // @ts-expect-error: No index signature for Window
    assert.notOk(window.SomethingRandom)
  })

  test('it adds application global to window using value of config.exportApplicationGlobal, if it is a String', async function (this: Context, assert) {
    this.application.register('config:environment', {
      modulePrefix: 'something-random',
      embedded: {
        delegateStart: true,
      },
      exportApplicationGlobal: 'SomethingElse',
    })

    await this.application.boot()

    assert.deepEqual(
      // @ts-expect-error: No index signature for Window
      window.SomethingElse,
      this.application,
      'name set in config is used for exported application global, instead of original module prefix',
    )

    assert.notOk(
      // @ts-expect-error: No index signature for Window
      window.SomethingRandom,
      'original module prefix is not used in exported application global',
    )
  })
})
