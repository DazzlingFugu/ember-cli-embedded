import { visit } from '@ember/test-helpers'
import { module, test } from 'qunit'
import { setupApplicationTest } from 'ember-qunit'

module('Acceptance | embedded app', function(hooks) {
  setupApplicationTest(hooks)

  test('visiting /embedded-app', async function(assert) {
    await visit('/')

    assert.ok(true)
  })
})
