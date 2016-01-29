import config from '../config/environment';
import Ember from 'ember';

export function initialize(appInstance) {
  Ember.$.extend(true, // Deep merge
    appInstance.container.lookup('config:environment').APP,
    appInstance.container.lookup('config:embedded')
  );
}

export default {
  name: 'embedded',
  initialize
};
