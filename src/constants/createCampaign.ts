import { TargetingInputSingle, IabTaxonomyV3 } from 'adex-common/dist/types'
import { CampaignUI, SelectData } from 'types'

export const CREATE_CAMPAIGN_STEPS = 4
export const CAMPAIGN_CATEGORIES_INPUT = 'targetingInput.inputs.categories'
export const CAMPAIGN_LOCATION_INPUT = 'targetingInput.inputs.location'

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

export const CREATE_CAMPAIGN_DEFAULT_VALUE: CampaignUI = {
  id: '',
  type: 0,
  step: 0,
  devices: [],
  paymentModel: 'cpm',
  startsAt: new Date(),
  endsAt: new Date(),
  currency: '',
  cpmMin: '',
  cpmMax: '',
  campaignName: '',
  outpaceAssetAddr: '',
  outpaceAssetDecimals: 0,
  outpaceAddr: '',
  campaignBudget: BigInt(0),
  outpaceChainId: 1,
  created: BigInt(Date.now()),
  nonce: BigInt(0),
  owner: '',
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
  activeFrom: BigInt(Date.now()),
  activeTo: BigInt(Date.now()),
  targetingInput: {
    version: '',
    inputs: {
      location: DEFAULT_CATS_LOCS_VALUE,
      categories: DEFAULT_CATS_LOCS_VALUE,
      publishers: DEFAULT_CATS_LOCS_VALUE,
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
