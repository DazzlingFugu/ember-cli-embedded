export function initialize(appInstance) {
  const appConf = appInstance.resolveRegistration('config:environment').APP;
  const embedConf = appInstance.resolveRegistration('config:embedded');
  return Object.assign(appConf, embedConf);
}

export default {
  name: 'embedded',
  initialize,
};
