import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import EmbeddedService from 'ember-cli-embedded/services/embedded'

module('Unit | Service | embedded', function (hooks) {
  setupTest(hooks)

  test('it fetches data from the config as a proxy', function (assert) {
    this.owner.register('config:embedded', {
      myKey: 'myValue',
    })

    const service = this.owner.lookup('service:embedded') as EmbeddedService

    assert.strictEqual(
      service.get('myKey'),
      'myValue'
    )

    assert.strictEqual(
      service.get('doesNotExist'),
      undefined
    )
  })
})
