import config from '../config/environment';
import lodash from 'lodash';

export function initialize(appInstance) {
  lodash.merge(
    appInstance.container.lookup('config:environment').APP,
    appInstance.container.lookup('config:embedded')
  );
}

export default {
  name: 'embedded',
  initialize
};
