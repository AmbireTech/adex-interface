import {
  TargetingInputSingle,
  TargetingPlacementInput,
  IabTaxonomyV3
} from 'adex-common/dist/types'
import { CampaignUI, SelectData } from 'types'

export const CREATE_CAMPAIGN_STEPS = 4
export const CAMPAIGN_CATEGORIES_INPUT = 'targetingInput.inputs.categories'
export const CAMPAIGN_LOCATION_INPUT = 'targetingInput.inputs.location'
export const CAMPAIGN_PLACEMENTS_INPUT = 'targetingInput.inputs.placements.in'
const THIRTY_DAYS_IN_MILLISECONDS = 2592000000

const dateNowPlusThirtyDays = () => {
  const currentDate = new Date()
  return new Date(currentDate.getTime() + THIRTY_DAYS_IN_MILLISECONDS)
}

const parseCats = () => {
  const arr: SelectData[] = []

  Object.entries(IabTaxonomyV3).forEach(([key, value]) => {
    arr.push({ value, label: key })
  })

  return arr
}

export const DEFAULT_CATS_LOCS_VALUE: TargetingInputSingle = {
  in: [],
  nin: [],
  apply: 'all'
}
export const DEFAULT_PLACEMENTS_VALUE: TargetingPlacementInput = {
  in: ['site'],
  nin: [],
  apply: 'in'
}

export const CREATE_CAMPAIGN_DEFAULT_VALUE: CampaignUI = {
  id: '',
  type: 0,
  step: 0,
  devices: [],
  paymentModel: 'cpm',
  startsAt: new Date(),
  endsAt: dateNowPlusThirtyDays(),
  currency: '',
  // cpmMin: '',
  // cpmMax: '',
  // campaignName: '',
  outpaceAssetAddr: '',
  outpaceAssetDecimals: 0,
  outpaceAddr: '',
  campaignBudget: 0n,
  outpaceChainId: 1,
  created: BigInt(Date.now()),
  nonce: 0n,
  owner: '',
  title: '',
  adUnits: [],
  validators: [],
  pricingBounds: {
    IMPRESSION: {
      min: 0n,
      max: 0n
    },
    CLICK: {
      min: 0n,
      max: 0n
    }
  },
  cpmPricingBounds: {
    min: 0n,
    max: 0n
  },
  targetingRules: [],
  activeFrom: BigInt(Date.now()),
  activeTo: BigInt(Date.now()),
  targetingInput: {
    version: '1',
    inputs: {
      location: DEFAULT_CATS_LOCS_VALUE,
      categories: DEFAULT_CATS_LOCS_VALUE,
      publishers: DEFAULT_CATS_LOCS_VALUE,
      placements: DEFAULT_PLACEMENTS_VALUE,
      advanced: {
        includeIncentivized: true,
        disableFrequencyCapping: false,
        limitDailyAverageSpending: false
      }
    }
  },
  status: 0,
  reviewStatus: 0,
  modified: BigInt(Date.now()),
  archived: false,
  createdBy: '',
  lastModifiedBy: ''
}

export const CATEGORIES: SelectData[] = parseCats()

// TODO: Add/get more Countries
export const COUNTRIES: SelectData[] = [
  { value: 'BG', label: 'Bulgaria' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'USA', label: 'United States of America' }
]
