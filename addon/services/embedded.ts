import ObjectProxy from '@ember/object/proxy'
import { getOwner } from '@ember/application'
import { assert } from '@ember/debug'

export default class EmbeddedService extends ObjectProxy {

  constructor() {
    super(...arguments) // eslint-disable-line prefer-rest-params

    const factoryName = 'config:embedded'
    const factory: Record<string, unknown> | undefined = getOwner(this).factoryFor(factoryName)

    assert(
      `The factory "${factoryName}" could not be found.`,
      typeof factory === 'object'
    )

    // eslint-disable-next-line @typescript-eslint/ban-types
    this.content = factory.class as object
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    embedded: EmbeddedService;
  }
}
