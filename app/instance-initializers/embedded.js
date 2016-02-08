import Ember from 'ember';

export function initialize(appInstance) {
  let lookupFactory;
  if (appInstance._lookupFactory) {
    lookupFactory = appInstance._lookupFactory.bind(appInstance);
  } else {
    lookupFactory = appInstance.container.lookupFactory.bind(appInstance.container);
  }
  const appConf = lookupFactory('config:environment').APP;
  const embedConf = lookupFactory('config:embedded');
  Ember.$.extend(true, appConf, embedConf);
}

export default {
  name: 'embedded',
  initialize
};
