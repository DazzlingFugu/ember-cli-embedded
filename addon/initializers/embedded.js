import Ember from 'ember';
import { resolveFactory } from '../helpers/registry';

const { get } = Ember;

export function initialize() {
  const application = arguments[1] || arguments[0];
  const { registry } = application;
  const env = resolveFactory(registry, application, 'config:environment');
  const isEmbedded = get(env, 'embedded');
  if (isEmbedded) {
    application.reopen({
      start: Ember.run.bind(application, function emberCliEmbeddedStart(config) {
        const embeddedConfig = Ember.Object.extend(
          isEmbedded === true ? {} : isEmbedded,
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
