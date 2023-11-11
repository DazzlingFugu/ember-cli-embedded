import Application from '@ember/application'
import { classify } from '@ember/string'

export function initialize(application: Application): void {
  const env = application.resolveRegistration('config:environment') as {
    embedded?: {
      delegateStart?: undefined | boolean
    }
    exportApplicationGlobal?: undefined | boolean | string
    modulePrefix: string
  }

  const mustExportApplicationGlobal =
    env.embedded?.delegateStart === true && env.exportApplicationGlobal !== false

  if (mustExportApplicationGlobal) {
    let theGlobal

    if (typeof window !== 'undefined') {
      theGlobal = window
      // @ts-expect-error: `global` comes from Node.js
    } else if (typeof global !== 'undefined') {
      // @ts-expect-error: `global` comes from Node.js
      theGlobal = global
    } else if (typeof self !== 'undefined') {
      theGlobal = self
    } else {
      return
    }

    const { exportApplicationGlobal } = env

    let globalName

    if (typeof exportApplicationGlobal === 'string') {
      globalName = exportApplicationGlobal
    } else {
      globalName = classify(env.modulePrefix)
    }

    if (!theGlobal[globalName]) {
      theGlobal[globalName] = application
    }
  }
}

export default {
  name: 'export-application-global',
  initialize,
}
