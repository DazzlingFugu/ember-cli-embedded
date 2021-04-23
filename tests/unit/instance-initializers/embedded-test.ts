import Application from '@ember/application';

import { initialize } from 'dummy/instance-initializers/embedded';
import { module, test } from 'qunit';
import Resolver from 'ember-resolver';
import { run } from '@ember/runloop';

module('Unit | Instance Initializer | embedded', function (hooks) {
  hooks.beforeEach(function () {
    this.TestApplication = class TestApplication extends Application {
      modulePrefix = 'random_value';
    };

    this.TestApplication.instanceInitializer({
      name: 'initializer under test',
      initialize,
    });

    this.application = this.TestApplication.create({
      autoboot: false,
      Resolver,
    });

    this.appInstance = this.application.buildInstance();
  });

  hooks.afterEach(function () {
    run(this.appInstance, 'destroy');
    run(this.application, 'destroy');
  });

  test('It works without config', async function (assert) {
    assert.expect(1);

    this.application.register('config:environment', {
      APP: {},
    });

    await this.appInstance.boot();

    assert.ok(true, 'It does not break');
  });

  test('It merges the embedded config into the `APP` config', async function (assert) {
    assert.expect(1);

    this.application.register('config:environment', {
      APP: {},
    });

    this.application.register('config:embedded', {
      yoKey: 'Yo Value!',
    });

    await this.appInstance.boot();

    assert.strictEqual(
      this.appInstance.resolveRegistration('config:environment').APP.yoKey,
      'Yo Value!',
      'The embedded config is melded into the `APP` config'
    );
  });
});
