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
    // TODO refactor once https://github.com/emberjs/ember.js/issues/19916 fixed
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const factory: { class: EmbeddedOptions } | undefined = (getOwner(this) as any).factoryFor(factoryName)

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
