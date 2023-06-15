export interface ObjectConfig {
  delegateStart?:
    | undefined
    | boolean

  config?:
    | undefined
    | Record<string, never> // empty object `{}`
    | Record<string, unknown>
}

export type NullishConfig =
  | null
  | undefined

export type DeprecatedBooleanConfig = boolean

export type GivenConfig =
  | NullishConfig
  | DeprecatedBooleanConfig
  | ObjectConfig