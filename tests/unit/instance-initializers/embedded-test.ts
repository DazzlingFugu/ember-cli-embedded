import Application from '@ember/application'

import { initialize } from 'dummy/instance-initializers/embedded'
import { module, test } from 'qunit'
import Resolver from 'ember-resolver'

import type { TestContext } from '@ember/test-helpers'
import type ApplicationInstance from '@ember/application/instance'

interface Context extends TestContext {
  TestApplication: typeof Application
  application: Application
  appInstance: ApplicationInstance
}

module('Unit | Instance Initializer | embedded', function (hooks) {
  hooks.beforeEach(function (this: Context) {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = 'random_value'
    }

    this.TestApplication.instanceInitializer({
      name: 'initializer under test',
      initialize,
    })

    this.application = this.TestApplication.create({
      autoboot: false,
      Resolver,
    })

    this.appInstance = this.application.buildInstance()
  })

  hooks.afterEach(function (this: Context) {
    this.appInstance.destroy()
    this.application.destroy()
  })

  test('It works when `embedded` config is not defined', async function (this: Context, assert) {
    this.application.register('config:environment', {
      APP: {},
    })

    await this.appInstance.boot()

    assert.deepEqual(
      this.appInstance.resolveRegistration('config:environment'),
      {
        APP: {},
      },
      /* block Prettier */
    )
  })

  test('The `embedded` config is merged into `APP` config', async function (this: Context, assert) {
    this.application.register('config:environment', {
      APP: {},
    })

    this.application.register('config:embedded', {
      yoKey: 'Yo Value!',
    })

    await this.appInstance.boot()

    assert.deepEqual(
      this.appInstance.resolveRegistration('config:environment'),
      {
        APP: {
          yoKey: 'Yo Value!',
        },
      },
      /* block Prettier */
    )
  })
})
