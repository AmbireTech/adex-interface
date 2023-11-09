import { Campaign } from 'types'

export const CREATE_CAMPAIGN_STEPS = 4
export const CREATE_CAMPAIGN_DEFAULT_VALUE: Campaign = {
  id: '',
  creator: '',
  step: 0,
  device: null,
  depositAssetAddr: '',
  depositAmount: BigInt(0),
  network: 0,
  created: BigInt(0),
  nonce: BigInt(0),
  title: '',
  adUnits: [],
  validators: [],
  pricingBounds: {
    IMPRESSION: {
      min: BigInt(0),
      max: BigInt(0)
    },
    CLICK: {
      min: BigInt(0),
      max: BigInt(0)
    }
  },
  targetingRules: [],
  targetingInput: {
    version: '',
    inputs: {
      location: [],
      categories: [],
      publishers: []
    }
  }
}
