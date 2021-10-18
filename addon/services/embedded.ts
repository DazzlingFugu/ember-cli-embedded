import ObjectProxy from '@ember/object/proxy'
import { getOwner } from '@ember/application'

export default class EmbeddedService extends ObjectProxy {

  constructor() {
    super(...arguments) // eslint-disable-line prefer-rest-params

    this.content = getOwner(this)
      .factoryFor('config:embedded')
      .class
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    embedded: EmbeddedService;
  }
}
