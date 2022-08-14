import { module, test } from 'qunit'
import { setupTest } from 'ember-qunit'
import type EmbeddedService from 'ember-cli-embedded/services/embedded'

module('Unit | Service | embedded', function (hooks) {
  setupTest(hooks)

  test('it fetches data from the config as a proxy', function (assert) {
    const options = { myKey: 'myValue' };

    this.owner.register('config:embedded', options)

    const service = this.owner.lookup('service:embedded') as EmbeddedService<typeof options>

    assert.strictEqual(
      service.get('myKey'),
      'myValue'
    )

    assert.strictEqual(
      // @ts-expect-error: We try to access a property which does not exist
      service.get('doesNotExist'),
      undefined
    )
  })
})
