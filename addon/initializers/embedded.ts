import Application from '@ember/application'
import { deprecate } from '@ember/debug'

import type { ObjectConfig, NullishConfig, DeprecatedBooleanConfig, GivenConfig } from '../../types'

function configIsNullish(config: GivenConfig): config is NullishConfig {
  return config === null || config === undefined
}

function configIsBoolean(config: GivenConfig): config is DeprecatedBooleanConfig {
  return typeof config === 'boolean'
}

function configIsObjectUnknown(config: ObjectConfig): config is Record<string, unknown> {
  return config.delegateStart === undefined && config.config === undefined
}

function normalizeConfig(userConfig: GivenConfig): ObjectConfig {
  if (configIsNullish(userConfig)) {
    return {
      delegateStart: false,
      config: {},
    }
  }

  if (configIsBoolean(userConfig)) {
    const embeddedConfig = { delegateStart: userConfig, config: {} }
    deprecate('The `embedded` config property MUST be `undefined` or an object', false, {
      id: 'ember-cli-embedded.bad-object-config',
      until: 'not defined',
      for: 'ember-cli-embedded',
      since: {
        available: '0.5.0',
        enabled: '0.5.0',
      },
    })

    return embeddedConfig
  }

  if (configIsObjectUnknown(userConfig)) {
    deprecate(
      'The config MUST contain a `delegateStart` property. ' +
        'Assuming `true` for backward compatibility. ' +
        'The config must now be defined in a `config` property',
      false,
      {
        id: 'ember-cli-embedded.bad-object-config',
        until: 'not defined',
        for: 'ember-cli-embedded',
        since: {
          available: '0.5.0',
          enabled: '0.5.0',
        },
      },
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
    userConfig,
  )
}

export function initialize(application: Application): void {
  const env = application.resolveRegistration('config:environment') as { embedded?: GivenConfig }
  const embeddedConfig: ObjectConfig = normalizeConfig(env.embedded)

  if (embeddedConfig.delegateStart) {
    // @ts-expect-error: Until correct public types are available
    application.reopen({
      start: function emberCliEmbeddedStart(this: Application, config = {}) {
        const _embeddedConfig = Object.assign({}, embeddedConfig.config, config)

        this.register('config:embedded', _embeddedConfig, { instantiate: false })

        this.advanceReadiness()
      }.bind(application),
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
