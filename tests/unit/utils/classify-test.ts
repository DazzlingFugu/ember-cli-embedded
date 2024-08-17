/**
 * The content of this file was extracted (then adapted) from:
 * https://github.com/emberjs/ember-string/blob/v4.0.0-%40ember/string/tests/unit/classify_test.ts
 */

import { classify } from 'ember-cli-embedded/utils/classify'
import { module, test } from 'qunit'

module('Unit | Utility | classify', function () {
  test('it works', function (assert) {
    assert.strictEqual(
      classify('my favorite items'),
      'MyFavoriteItems',
      'classify normal string',
      /* */
    )

    assert.strictEqual(
      classify('css-class-name'),
      'CssClassName',
      'classify dasherized string',
      /* */
    )

    assert.strictEqual(
      classify('action_name'),
      'ActionName',
      'classify underscored string',
      /* */
    )

    assert.strictEqual(
      classify('privateDocs/ownerInvoice'),
      'PrivateDocs/OwnerInvoice',
      'classify namespaced camelized string',
    )

    assert.strictEqual(
      classify('private_docs/owner_invoice'),
      'PrivateDocs/OwnerInvoice',
      'classify namespaced underscored string',
    )

    assert.strictEqual(
      classify('private-docs/owner-invoice'),
      'PrivateDocs/OwnerInvoice',
      'classify namespaced dasherized string',
    )

    assert.strictEqual(
      classify('-view-registry'),
      '_ViewRegistry',
      'classify prefixed dasherized string',
    )

    assert.strictEqual(
      classify('components/-text-field'),
      'Components/_TextField',
      'classify namespaced prefixed dasherized string',
    )

    assert.strictEqual(
      classify('_Foo_Bar'),
      '_FooBar',
      'classify underscore-prefixed underscored string',
    )

    assert.strictEqual(
      classify('_Foo-Bar'),
      '_FooBar',
      'classify underscore-prefixed dasherized string',
    )

    assert.strictEqual(
      classify('_foo/_bar'),
      '_Foo/_Bar',
      'classify underscore-prefixed-namespaced underscore-prefixed string',
    )

    assert.strictEqual(
      classify('-foo/_bar'),
      '_Foo/_Bar',
      'classify dash-prefixed-namespaced underscore-prefixed string',
    )

    assert.strictEqual(
      classify('-foo/-bar'),
      '_Foo/_Bar',
      'classify dash-prefixed-namespaced dash-prefixed string',
    )

    assert.strictEqual(
      /* */
      classify('InnerHTML'),
      'InnerHTML',
      'does nothing with classified string',
    )

    assert.strictEqual(
      classify('_FooBar'),
      '_FooBar',
      'does nothing with classified prefixed string',
    )
  })
})
