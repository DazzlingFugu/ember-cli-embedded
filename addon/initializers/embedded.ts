import Application from '@ember/application'
import { deprecate } from '@ember/debug'
import { run } from '@ember/runloop'

interface ObjectConfig {
  delegateStart?:
    | undefined
    | boolean

  config?:
    | undefined
    | Record<string, never> // empty object `{}`
    | Record<string, unknown>
}

type VoidConfig =
  | null
  | undefined

type DeprecatedBooleanConfig = boolean

type GivenConfig =
  | VoidConfig
  | DeprecatedBooleanConfig
  | ObjectConfig

function configIsVoid(config: GivenConfig): config is VoidConfig {
  return [null, undefined].includes(config as VoidConfig)
}

function configIsBoolean(config: GivenConfig): config is DeprecatedBooleanConfig {
  return typeof config === 'boolean'
}

function configIsObjectUnknown(config: ObjectConfig): config is Record<string, unknown> {
  return (
    config.delegateStart === undefined
    && config.config === undefined
  )
}

function normalizeConfig(userConfig: GivenConfig): ObjectConfig {
  if (configIsVoid(userConfig)) {
    return {
      delegateStart: false,
      config: {},
    }
  }

  if (configIsBoolean(userConfig)) {
    const embeddedConfig = { delegateStart: userConfig, config: {} }
    deprecate(
      'The `embedded` config property MUST be `undefined` or an an object',
      false,
      {
        id: 'bad-object-config',
        until: '1.0.0',
      }
    )

    return embeddedConfig
  }

  if (configIsObjectUnknown(userConfig)) {
    deprecate(
      'The config MUST contain a `delegateStart` property. '
      + 'Assuming `true` for backward compatibility. '
      + 'The config must now be defined in a `config` property',
      false,
      {
        id: 'bad-object-config',
        until: '1.0.0',
      }
    )

    return {
      delegateStart: true,
      config: userConfig,
    }
  }

  return Object.assign(
    {
      config: {},
    },
    userConfig
  )
}

export function initialize(application: Application): void {
  const env = application.resolveRegistration('config:environment')
  const embeddedConfig: ObjectConfig = normalizeConfig(env.embedded)

  if (embeddedConfig.delegateStart) {
    // @ts-ignore: until correct public types are available
    application.reopen({
      start: run.bind(application, function emberCliEmbeddedStart(config = {}) {
        const _embeddedConfig = Object.assign(
          {},
          embeddedConfig.config,
          config
        )

        this.register('config:embedded', _embeddedConfig, { instantiate: false })

        this.advanceReadiness()
      }),
    })
    application.deferReadiness()
  } else {
    application.register('config:embedded', embeddedConfig.config)
  }
}

export default {
  name: 'ember-cli-embedded',
  after: 'export-application-global',
  initialize,
}
