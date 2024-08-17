/**
 * The content of this file was partially copied-pasted from:
 * https://github.com/emberjs/ember-string/blob/v4.0.0-%40ember/string/src/index.ts
 */

const STRING_CLASSIFY_REGEXP_1 = /^(-|_)+(.)?/
const STRING_CLASSIFY_REGEXP_2 = /(.)(-|_|\.|\s)+(.)?/g
const STRING_CLASSIFY_REGEXP_3 = /(^|\/|\.)([a-z])/g

function CLASSIFY_CACHE(str: string) {
  const replace1 = (_match: string, _separator: string, chr: string) =>
    chr ? `_${chr.toUpperCase()}` : ''

  const replace2 = (_match: string, initialChar: string, _separator: string, chr: string) =>
    initialChar + (chr ? chr.toUpperCase() : '')

  const parts = str.split('/')

  for (let i = 0; i < parts.length; i++) {
    parts[i] = (parts[i] ?? '')
      .replace(STRING_CLASSIFY_REGEXP_1, replace1)
      .replace(STRING_CLASSIFY_REGEXP_2, replace2)
  }

  return parts
    .join('/')
    .replace(STRING_CLASSIFY_REGEXP_3, (match /*, separator, chr */) => match.toUpperCase())
}

/**
 * Returns the UpperCamelCase form of a string.
 *
 * ```javascript
 * classify('innerHTML');                   // 'InnerHTML'
 * classify('action_name');                 // 'ActionName'
 * classify('css-class-name');              // 'CssClassName'
 * classify('my favorite items');           // 'MyFavoriteItems'
 * classify('private-docs/owner-invoice');  // 'PrivateDocs/OwnerInvoice'
 * ```
 *
 * @param {string} str the string to classify
 * @return {string} the classified string
 */
export function classify(str: string): string {
  return CLASSIFY_CACHE(str)
}
