import { Devices } from './createCampaign'

export type PaymentModelType = 'cpm' | 'cpc'

export type Format = {
  /** Width in device independent pixels (DIPS). */
  w?: number
  /** Height in device independent pixels (DIPS). */
  h?: number
  /** Relative width when expressing size as a ratio. */
  wratio?: number
  /** Relative height when expressing size as a ratio. */
  hratio?: number
}

export type Banner = {
  format: Format
  mime: string
  mediaUrl: string
  targetUrl: string
  created: bigint
}

export enum AdUnitType {
  Banner,
  Video,
  Audio,
  Native,
  Pmp
}

export type AdUnit = {
  id: string
  title: string
  type: AdUnitType
  /** Banner object */
  banner?: Banner
  //     /** Video object */
  //     video?: Video
  //     /** Audio object */
  //     audio?: Audio
  //     /** Native object */
  //     native?: Native
  //     /** Private marketplace object */
  //     pmp?: Pmp
}

export type Validator = {
  id: string
  url: string
  fee: bigint
}

export type Bound = {
  min: bigint
  max: bigint
}

export type PricingBound = {
  IMPRESSION?: Bound
  CLICK?: Bound
}

export type TargetingRuleProps =
  | 'onlyShowIf'
  | 'if'
  | 'and'
  | 'ifNot'
  | 'ifNot'
  | 'do'
  | 'in'
  | 'nin'
  | 'intersects'
  | 'at'
  | 'eq'
  | 'lt'
  | 'gt'
  | 'gte'
  | 'not'
  | 'or'
  | 'div'
  | 'mod'
  | 'mul'
  | 'add'
  | 'sub'
  | 'max'
  | 'min'
  | 'mulDiv'
  | 'bn'
  | 'split'
  | 'endsWith'
  | 'startsWith'
  | 'get'
  | 'set'

export type TargetingRule = {
  [key in TargetingRuleProps]: string | boolean | TargetingRule[] | number | bigint
}

export type TargetingInputProps = 'in' | 'nin' | 'allIn'

export type TargetingInputSingle = {
  [key in TargetingInputProps]: string[]
}

export type TargetingInput = {
  version: string
  inputs: {
    location: TargetingInputSingle[]
    categories: TargetingInputSingle[]
    publishers: TargetingInputSingle[]
  }
}

export type Campaign = {
  id: string
  creator: string
  step: number
  device: Devices | null
  depositAssetAddr: string
  depositAmount: bigint
  network: number
  /** Timestamp in ms */
  created: bigint
  nonce: bigint
  startsAt: Date | null
  endsAt: Date | null
  paymentModel: PaymentModelType

  // Spec Props - mutable
  title: string
  adUnits: AdUnit[]
  validators: Validator[]
  pricingBounds: PricingBound
  targetingRules: TargetingRule[]

  // User inputs
  targetingInput: TargetingInput
}
