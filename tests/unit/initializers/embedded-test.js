import Ember from 'ember';
import { initialize } from '../../../initializers/embedded';
import { module, test } from 'qunit';
import { resolve } from 'ember-cli-embedded/helpers/registry';

let registry, application;
const appName = 'my-app-name';
const camelized = Ember.String.camelize(appName);

module('Unit | Initializer | embedded', {
  setup() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.set('name', appName);
      registry = application.registry;
      application.deferReadiness();
    });
  },
  teardown() {
    Ember.run(function() {
      application.destroy();
    });
  }
});

test('it works without any specific config', function(assert) {
  application.register('config:environment', {});
  initialize(registry, application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});

test('it does not expose when embedded config is falsy', function(assert) {
  application.register('config:environment', { embedded: false });
  initialize(registry, application);

  assert.ok(window.beep === undefined);
  assert.ok(application.start === undefined);
});

test('it defers readiness of the app', function(assert) {
  application.register('config:environment', { embedded: true });
  const { _readinessDeferrals:initialDeferrals } = application;
  initialize(registry, application);

  assert.equal(application._readinessDeferrals, initialDeferrals + 1, 'it added a deferral');
});

test('it exposes under the camelized app name by default', function(assert) {
  application.register('config:environment', { embedded: true });
  initialize(registry, application);

  assert.ok(window[camelized]);
  assert.equal(window[camelized], application, 'it exposes the full app');
});

test('it exposes under a custom name if provided', function(assert) {
  application.register('config:environment', { embedded: { name: 'beep' } });
  initialize(registry, application);

  assert.ok(window.beep, 'it prefers the embedded name');
  assert.equal(window.beep, application, 'it exposes the full app');
});

test('it adds a start method for convenience', function(assert) {
  application.register('config:environment', { embedded: { name: 'beep' } });
  initialize(registry, application);

  assert.ok(application.start);
  assert.equal(typeof application.start, 'function');
});

test('calling start allows to resume the bootstrap', function(assert) {
  assert.expect(1);
  application.register('config:environment', { embedded: { name: 'beep' } });
  initialize(registry, application);
  application.deferReadiness(); // We make sure the all won't start

  const { _readinessDeferrals:initialDeferrals } = application;
  application.start();
  assert.equal(application._readinessDeferrals, initialDeferrals - 1, 'it removed a deferral');
});

test('The config is registered in the container', function(assert) {
  application.register('config:environment', { embedded: { name: 'beep' } });
  initialize(registry, application);
  application.deferReadiness(); // We make sure the all won't start

  application.start();
  assert.ok(resolve(application.registry, application, 'config:embedded'));
});

test('The config is merged', function(assert) {
  application.register('config:environment', { embedded: { name: 'beep', config: { env: true } } });
  initialize(registry, application);
  application.deferReadiness(); // We make sure the all won't start

  application.start({ bootstrap: true });
  const embedConfig = resolve(application.registry, application, 'config:embedded');
  assert.ok(embedConfig.get('env'));
  assert.ok(embedConfig.get('bootstrap'));
});

test('The config during bootstrap has a greater priority', function(assert) {
  application.register('config:environment', { embedded: { name: 'beep', config: { woow: 'such code' } } });
  initialize(registry, application);
  application.deferReadiness(); // We make sure the all won't start

  application.start({ woow: 'much tests' });
  const embedConfig = resolve(application.registry, application, 'config:embedded');
  assert.equal(embedConfig.get('woow'), 'much tests');
});
