// Types for compiled templates
declare module 'ember-cli-embedded/templates/*' {
  import { TemplateFactory } from 'ember-cli-htmlbars'

  const tmpl: TemplateFactory
  export default tmpl
}
