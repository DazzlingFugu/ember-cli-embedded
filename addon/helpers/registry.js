export function resolve(registry, application, name) {
  if (registry.container) {
    // pre Ember-2.2.0
    return registry.container().lookup(name);
  } else {
    return application.__container__.lookup('config:embedded');
  }
}
export function resolveFactory(registry, application, name) {
  if (registry.container) {
    // pre Ember-2.2.0
    return registry.container().lookupFactory(name);
  } else {
    return application.resolveRegistration(name);
  }
}
