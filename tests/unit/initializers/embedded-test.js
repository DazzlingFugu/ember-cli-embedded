import Ember from 'ember';
import { initialize } from '../../../initializers/embedded';
import { module, test } from 'qunit';
import { resolveFactory } from 'ember-cli-embedded/helpers/registry';

let registry, application;
const appName = 'my-app-name';

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
  initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});

test('it does not expose when embedded config is falsy', function(assert) {
  application.register('config:environment', { embedded: false });
  initialize(application);

  assert.ok(window.beep === undefined);
  assert.ok(application.start === undefined);
});

test('it defers readiness of the app', function(assert) {
  application.register('config:environment', { embedded: true });
  const { _readinessDeferrals:initialDeferrals } = application;
  initialize(application);

  assert.equal(application._readinessDeferrals, initialDeferrals + 1, 'it added a deferral');
});

test('it adds a start method for convenience', function(assert) {
  application.register('config:environment', { embedded: { name: 'beep' } });
  initialize(application);

  assert.ok(application.start);
  assert.equal(typeof application.start, 'function');
});

test('calling start allows to resume the bootstrap', function(assert) {
  assert.expect(1);
  application.register('config:environment', { embedded: {} });
  initialize(application);
  application.deferReadiness(); // We make sure the all won't start

  const { _readinessDeferrals:initialDeferrals } = application;
  application.start();
  assert.equal(application._readinessDeferrals, initialDeferrals - 1, 'it removed a deferral');
});

test('The config is registered in the container', function(assert) {
  application.register('config:environment', { embedded: {} });
  initialize(application);
  application.deferReadiness(); // We make sure the all won't start

  application.start();
  assert.ok(resolveFactory(application.registry, application, 'config:embedded'));
});

test('The config is merged', function(assert) {
  application.register('config:environment', { embedded: { env: 'bla' } });
  initialize(application);
  application.deferReadiness(); // We make sure the all won't start

  application.start({ bootstrap: true });
  const embedConfig = resolveFactory(application.registry, application, 'config:embedded');
  assert.equal(Ember.get(embedConfig, 'env'), 'bla');
  assert.ok(Ember.get(embedConfig, 'bootstrap'));
});

test('The config during bootstrap has a greater priority', function(assert) {
  application.register('config:environment', { embedded: { woow: 'such code' } });
  initialize(application);
  application.deferReadiness(); // We make sure the all won't start

  application.start({ woow: 'much tests' });
  const embedConfig = resolveFactory(application.registry, application, 'config:embedded');
  assert.equal(Ember.get(embedConfig, 'woow'), 'much tests');
});
