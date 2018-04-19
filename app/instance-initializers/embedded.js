import $ from 'jquery';

export function initialize(appInstance) {
  const appConf = appInstance.resolveRegistration('config:environment').APP;
  const embedConf = appInstance.resolveRegistration('config:embedded');
  $.extend(true, appConf, embedConf);
}

export default {
  name: 'embedded',
  initialize
};
