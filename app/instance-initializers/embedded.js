import Ember from 'ember';

export function initialize(appInstance) {
  const appConf = appInstance.resolveRegistration('config:environment').APP;
  const embedConf = appInstance.resolveRegistration('config:embedded');
  Ember.$.extend(true, appConf, embedConf);
}

export default {
  name: 'embedded',
  initialize
};
