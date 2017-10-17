import Ember from 'ember';
import { initialize } from '../../../instance-initializers/embedded';
import { module, test } from 'qunit';

module('Unit | Instance Initializer | embedded', {
  beforeEach() {
    Ember.run(() => {
      this.application = Ember.Application.create();
      this.application.setupForTesting();
      this.application.injectTestHelpers();
      this.appInstance = this.application.buildInstance();
    });
  },
  afterEach() {
    Ember.run(this.appInstance, 'destroy');
  }
});

test('It works without config', function(assert) {
  this.application.register('config:environment', { APP: {}, embedded: true }, { instantiate: false });
  initialize(this.appInstance);

  assert.ok(true, 'it does not break');
});

test('It merges the embedded config back to the App Config', function(assert) {
  this.application.register('config:environment', { APP: {}, embedded: true }, { instantiate: false });
  this.application.register('config:embedded', { yoKey: 'Yo Value!' }, { instantiate: false });
  initialize(this.appInstance);

  assert.equal(this.appInstance.resolveRegistration('config:environment').APP.yoKey, 'Yo Value!');
});
