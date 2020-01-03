import { deprecate } from '@ember/application/deprecations';
import { run } from '@ember/runloop';
import { get } from '@ember/object';
import jQuery from 'jquery';

export function initialize() {
  const application = arguments[1] || arguments[0];
  const env = application.resolveRegistration('config:environment');
  let embeddedConfig = get(env, 'embedded');
  const configIsAbsent = embeddedConfig === undefined;
  const configIsBoolean = embeddedConfig === !!embeddedConfig;
  const configIsAnObject = typeof embeddedConfig === 'object';
  const configIsValid = configIsAbsent || configIsAnObject;
  deprecate('The `embedded` config property MUST be undefined or an an object', configIsValid, { id: 'bad-object-config', until: '1.0.0' });

  if (configIsAbsent) {
    embeddedConfig = { delegateStart: false, config: {} };
  }

  if (configIsBoolean) {
    embeddedConfig = { delegateStart: embeddedConfig, config: {} };
  }

  if (configIsAnObject) {
    let { delegateStart, config = {} } = embeddedConfig;
    let delegateStartIsUndefined = delegateStart === undefined;
    deprecate('The config MUST contain a `delegateStart` property. Assuming `true` for backward compatibility. The config must now be defined in a `config` property', !delegateStartIsUndefined, { id: 'bad-object-config', until: '1.0.0' });
    if (delegateStartIsUndefined) {
      delegateStart = true;
      config = embeddedConfig || {};
    }
    embeddedConfig = { delegateStart, config };
  }

  if (embeddedConfig.delegateStart) {
    application.reopen({
      start: run.bind(application, function emberCliEmbeddedStart(config = {}) {
        const _embeddedConfig = jQuery.extend(true,
          {},
          embeddedConfig.config,
          config
        );
        this.register('config:embedded', _embeddedConfig);
        this.advanceReadiness();
      })
    });
    application.deferReadiness();
  } else {
    application.register('config:embedded', embeddedConfig.config);
  }
}

export default {
  name: 'ember-cli-embedded',
  after: 'export-application-global',
  initialize
};
