import ObjectProxy from '@ember/object/proxy'
import { getOwner } from '@ember/application'

// eslint-disable-next-line ember/no-classic-classes
const configService = ObjectProxy.extend({
  init(...args: Array<Record<string, unknown>>): void {
    this.content = getOwner(this).factoryFor('config:embedded').class
    this._super(...args)
  },
})

configService.reopenClass({
  isServiceFactory: true,
})

export default configService
