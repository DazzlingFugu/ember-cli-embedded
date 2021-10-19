import ObjectProxy from '@ember/object/proxy'
import { getOwner } from '@ember/application'
import { assert } from '@ember/debug'

type AnyObject = Record<string, unknown>

export default class EmbeddedService<
  EmbeddedOptions extends AnyObject = AnyObject
> extends ObjectProxy<EmbeddedOptions> {

  constructor() {
    super(...arguments) // eslint-disable-line prefer-rest-params

    const factoryName = 'config:embedded'
    const factory: { class: EmbeddedOptions } | undefined = getOwner(this).factoryFor(factoryName)

    assert(
      `The factory "${factoryName}" could not be found.`,
      typeof factory === 'object'
    )

    this.content = factory.class
  }

}

// DO NOT DELETE: this is how TypeScript knows how to look up your services.
declare module '@ember/service' {
  interface Registry {
    embedded: EmbeddedService;
  }
}
