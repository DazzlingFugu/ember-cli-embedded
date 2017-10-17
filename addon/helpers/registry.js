export function resolve(application) {
  return application.__container__.lookup('config:embedded');
}

export function resolveFactory(application, name) {
  return application.__container__.lookup(name);
}
