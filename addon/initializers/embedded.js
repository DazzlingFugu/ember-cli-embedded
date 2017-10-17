import Ember from 'ember';

const { get } = Ember;

export function initialize() {
  const application = arguments[1] || arguments[0];
  const env = application.resolveRegistration('config:environment');
  const isEmbedded = get(env, 'embedded');
  if (isEmbedded) {
    application.reopen({
      start: Ember.run.bind(application, function emberCliEmbeddedStart(config) {
        const embeddedConfig = Ember.$.extend(true,
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
