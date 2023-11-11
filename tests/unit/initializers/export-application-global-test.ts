import Application from '@ember/application'
import { initialize } from 'dummy/initializers/export-application-global'
import { module, test } from 'qunit'
import Resolver from 'ember-resolver'
import { classify } from '@ember/string'
import { run } from '@ember/runloop'

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

    // @ts-ignore: temporarily required as public types are incomplete
    this.application = this.TestApplication.create({
      autoboot: false,
      Resolver,
    })

    this.application.register('config:environment', {})
  })

  hooks.afterEach(function (this: Context) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO replace `any`
    const config: any = this.application.resolveRegistration('config:environment')
    const exportedApplicationGlobal: string = classify(config.modulePrefix)
    // @ts-ignore: because TS doesn't like window[dynamicPropertyName]
    delete window[exportedApplicationGlobal]
    run(this.application, 'destroy')
  })

  // @ts-ignore: because QUnit is not set up with TS propertly and does not like .each()
  test.each(
    'it adds expected application global to window if config.embedded.delegateStart is true',
    [
      ['something-random', 'SomethingRandom'],
      ['something_more-random', 'SomethingMoreRandom'],
      ['something-', 'Something'],
      ['something', 'Something'],
    ],
    async function (
      this: Context,
      assert: Record<string, unknown>,
      testData: Array<Array<string>>,
    ) {
      const [modulePrefix, exportedApplicationGlobal] = testData

      this.application.register('config:environment', {
        modulePrefix,
        embedded: {
          delegateStart: true,
        },
      })

      await this.application.boot()

      // @ts-expect-error: TODO incorrect types
      assert.strictEqual(
        // @ts-ignore: because TS doesn't like modulePrefix
        classify(modulePrefix),
        exportedApplicationGlobal,
        'it "classifies" module prefix',
      )

      // @ts-expect-error: TODO incorrect types
      assert.deepEqual(
        // @ts-ignore: because TS doesn't like window[dynamicPropertyName]
        window[exportedApplicationGlobal],
        this.application,
        'it creates expected application global on window',
      )
    },
  )

  test('it does not add application global to window if config.embedded.delegateStart is not true', async function (this: Context, assert) {
    this.application.register('config:environment', {
      modulePrefix: 'something-random',
    })

    await this.application.boot()

    // @ts-ignore: because TS doesn't like window[dynamicPropertyName]
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

    // @ts-ignore: because TS doesn't like window[dynamicPropertyName]
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
      // @ts-ignore: because TS doesn't like window.PropertyName ?
      window.SomethingElse,
      this.application,
      'name set in config is used for exported application global, instead of original module prefix',
    )

    assert.notOk(
      // @ts-ignore: because TS doesn't like window.PropertyName ?
      window.SomethingRandom,
      'original module prefix is not used in exported application global',
    )
  })
})
