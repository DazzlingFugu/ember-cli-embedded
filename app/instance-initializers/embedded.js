import jQuery from 'jquery';

export function initialize(appInstance) {
  const appConf = appInstance.resolveRegistration('config:environment').APP;
  const embedConf = appInstance.resolveRegistration('config:embedded');
  jQuery.extend(true, appConf, embedConf);
}

export default {
  name: 'embedded',
  initialize
};
