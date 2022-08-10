import ApplicationInstance from '@ember/application/instance'

export function initialize(appInstance: ApplicationInstance): void {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: https://github.com/typed-ember/ember-cli-typescript/issues/1471
  const appConf = appInstance.resolveRegistration('config:environment').APP
  const embedConf = appInstance.resolveRegistration('config:embedded')

  Object.assign(appConf, embedConf)
}

export default {
  name: 'embedded',
  initialize,
}
