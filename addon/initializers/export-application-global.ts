import Application from '@ember/application'
import { classify } from '@ember/string'

export function initialize(application: Application): void {
  const env = application.resolveRegistration('config:environment') as { 
    embedded?: {
      delegateStart: boolean
    },
    exportApplicationGlobal: boolean | string,
    modulePrefix: string
   }

  const mustExportApplicationGlobal = env.embedded?.delegateStart === true && env.exportApplicationGlobal !== false
  
  if (mustExportApplicationGlobal) {
    let theGlobal
    
    if (typeof window !== 'undefined') {
      theGlobal = window
    } else if (typeof global !== 'undefined') {
      theGlobal = global
    } else if (typeof self !== 'undefined') {
      theGlobal = self
    } else {
      return
    }

    const value = env.exportApplicationGlobal
    
    let globalName

    if (typeof value === 'string') {
      globalName = value
    } else {
      globalName = classify(env.modulePrefix)
    }

    // @ts-ignore: until there's a way to access a dynamic propertyName of window in TS ?
    if (!theGlobal[globalName]) {
      // @ts-ignore: until there's a way to set a dynamic propertyName on the window in TS ?
      theGlobal[globalName] = application
    }
  }
}

export default {
  name: 'export-application-global',
  initialize
}