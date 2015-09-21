import Ember from 'ember';

const { String: { camelize } } = Ember;

const { get, getWithDefault } = Ember;
export function initialize(registry, application) {
  const env = registry.container().lookupFactory('config:environment');
  if (get(env, 'embedded')) {
    const appName = camelize(getWithDefault(application, 'name', ''));
    const embeddedName = get(env, 'embedded.name');
    const exposedName = embeddedName || appName;
    Ember.assert('The aplication has no name and must be embedded. Can not determine a name for the app.', !!exposedName);
    application.deferReadiness();
    window[exposedName] = application;
    application.start = Ember.run.bind(application, function(config) {
      const embeddedConfig = Ember.Object.extend(
        getWithDefault(env, 'embedded.config', {}),
        config || {}
      );
      this.register('config:embedded', embeddedConfig);
      this.advanceReadiness();
    });
  }
}

export default {
  name: 'embedded',
  initialize
};
