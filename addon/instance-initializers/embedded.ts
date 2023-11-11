import ApplicationInstance from '@ember/application/instance'

export function initialize(appInstance: ApplicationInstance): void {
  // @ts-expect-error: https://github.com/typed-ember/ember-cli-typescript/issues/1471
  const appConf = appInstance.resolveRegistration('config:environment').APP
  const embedConf = appInstance.resolveRegistration('config:embedded')

  Object.assign(appConf, embedConf)
}

export default {
  name: 'embedded',
  initialize,
}
