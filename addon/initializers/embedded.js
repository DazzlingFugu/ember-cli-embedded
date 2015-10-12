import Ember from 'ember';
import { resolveFactory } from '../helpers/registry';

const { get, getWithDefault } = Ember;

export function initialize(registry, application) {
  const env = resolveFactory(registry, application, 'config:environment');
  if (get(env, 'embedded')) {
    application.reopen({
      start: Ember.run.bind(application, function(config) {
        const embeddedConfig = Ember.Object.extend(
          getWithDefault(env, 'embedded.config', {}),
          config || {}
        );
        this.register('config:embedded', embeddedConfig);
        this.advanceReadiness();
      })
    });
    application.deferReadiness();
  }
}

export default {
  name: 'ember-cli-embedded',
  after: 'export-application-global',
  initialize
};
