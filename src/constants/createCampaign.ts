import { CampaignUI, SelectData } from 'types'
import {
  TargetingInputSingle,
  TargetingPlacementInput,
  IabTaxonomyV3,
  AllCountries
} from 'adex-common'

export const CREATE_CAMPAIGN_STEPS = 4
export const CAMPAIGN_CATEGORIES_INPUT = 'targetingInput.inputs.categories'
export const CAMPAIGN_LOCATION_INPUT = 'targetingInput.inputs.location'
export const CAMPAIGN_PLACEMENTS_INPUT = 'targetingInput.inputs.placements.in'
export const CAMPAIGN_INCLUDE_INCENTIVIZED_INPUT =
  'targetingInput.inputs.advanced.includeIncentivized'
export const CAMPAIGN_DISABLE_FREQUENCY_CAPPING_INPUT =
  'targetingInput.inputs.advanced.disableFrequencyCapping'
export const CAMPAIGN_LIMIT_DAILY_AVERAGE_SPENDING_INPUT =
  'targetingInput.inputs.advanced.limitDailyAverageSpending'

const THIRTY_DAYS_IN_MILLISECONDS = 2592000000

export const dateNowPlusThirtyDays = () => {
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

const parseLocs = () => {
  const countries: SelectData[] = AllCountries.map((country) => ({
    value: country.code,
    label: country.name
  }))

  return countries
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
  autoUTMChecked: false,
  asapStartingDate: false,
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
    min: '',
    max: ''
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
        includeIncentivized: false,
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
  lastModifiedBy: '',
  draftModified: false,
  errorsTargetURLValidations: {}
}

export const CATEGORIES: SelectData[] = parseCats()
export const COUNTRIES: SelectData[] = parseLocs()

export const CAT_GROUPS = {
  Finance: ['IAB13', 'IAB13-7'],
  Gaming: ['IAB1', 'IAB9', 'IAB17'],
  Streaming: ['IAB1', 'IAB9', 'IAB17', 'IAB19']
}

export const REGION_GROUPS = {
  Africa: [
    'DZA',
    'AGO',
    'BEN',
    'BWA',
    'BFA',
    'BDI',
    'CPV',
    'CMR',
    'CAF',
    'TCD',
    'COM',
    'COG',
    'COD',
    'DJI',
    'EGY',
    'GNQ',
    'ERI',
    'SWZ',
    'ETH',
    'GAB',
    'GMB',
    'GHA',
    'GIN',
    'GNB',
    'CIV',
    'KEN',
    'LSO',
    'LBR',
    'LBY',
    'MDG',
    'MWI',
    'MLI',
    'MRT',
    'MUS',
    'MAR',
    'MOZ',
    'NAM',
    'NER',
    'NGA',
    'RWA',
    'STP',
    'SEN',
    'SYC',
    'SLE',
    'SOM',
    'ZAF',
    'SSD',
    'SDN',
    'TZA',
    'TGO',
    'TUN',
    'UGA',
    'ZMB',
    'ZWE'
  ],
  Asia: [
    'AFG',
    'ARM',
    'AZE',
    'BHR',
    'BGD',
    'BTN',
    'BRN',
    'KHM',
    'CHN',
    'CYP',
    'GEO',
    'IND',
    'IDN',
    'IRN',
    'IRQ',
    'ISR',
    'JPN',
    'JOR',
    'KAZ',
    'KWT',
    'KGZ',
    'LAO',
    'LBN',
    'MYS',
    'MDV',
    'MNG',
    'MMR',
    'NPL',
    'PRK',
    'OMN',
    'PAK',
    'PSE',
    'PHL',
    'QAT',
    'SAU',
    'SGP',
    'KOR',
    'LKA',
    'SYR',
    'TWN',
    'TJK',
    'THA',
    'TLS',
    'TUR',
    'TKM',
    'ARE',
    'UZB',
    'VNM',
    'YEM'
  ],
  Europe: [
    'ALB',
    'AND',
    'AUT',
    'BLR',
    'BEL',
    'BIH',
    'BGR',
    'HRV',
    'CYP',
    'CZE',
    'DNK',
    'EST',
    'FIN',
    'FRA',
    'DEU',
    'GRC',
    'HUN',
    'ISL',
    'IRL',
    'ITA',
    'KOS',
    'LVA',
    'LIE',
    'LTU',
    'LUX',
    'MLT',
    'MDA',
    'MCO',
    'MNE',
    'NLD',
    'MKD',
    'NOR',
    'POL',
    'PRT',
    'ROU',
    'RUS',
    'SMR',
    'SRB',
    'SVK',
    'SVN',
    'ESP',
    'SWE',
    'CHE',
    'UKR',
    'GBR',
    'VAT'
  ],
  'North America': [
    'ATG',
    'BHS',
    'BRB',
    'BLZ',
    'CAN',
    'CRI',
    'CUB',
    'DMA',
    'DOM',
    'SLV',
    'GRD',
    'GTM',
    'HTI',
    'HND',
    'JAM',
    'MEX',
    'NIC',
    'PAN',
    'KNA',
    'LCA',
    'VCT',
    'TTO',
    'USA'
  ],
  Oceania: [
    'AUS',
    'FJI',
    'KIR',
    'MHL',
    'FSM',
    'NRU',
    'NZL',
    'PLW',
    'PNG',
    'WSM',
    'SLB',
    'TON',
    'TUV',
    'VUT'
  ],
  'South America': [
    'ARG',
    'BOL',
    'BRA',
    'CHL',
    'COL',
    'ECU',
    'GUY',
    'PRY',
    'PER',
    'SUR',
    'URY',
    'VEN'
  ]
}
