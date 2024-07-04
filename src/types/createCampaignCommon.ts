import { AdUnit, Campaign } from 'adex-common/dist/types/Dsp/Campaign'
import { Alpha3Code } from 'adex-common'

export type Devices = 'mobile' | 'desktop'
export type SelectData = { value: string | Alpha3Code; label: string; group?: string }

export type PaymentModelType = 'cpm' | 'cpc'
export type AdUnitExtended = AdUnit & {
  error?: string
}

export type ErrorTargetUrl = {
  errMsg: string
}

export type ErrorsTargetURLValidations = {
  [key: string]: ErrorTargetUrl
}

export type CampaignUI = Campaign & {
  step: number
  devices: Devices[]
  paymentModel: PaymentModelType
  startsAt: Date
  endsAt: Date
  currency: string
  cpmPricingBounds: {
    min: string
    max: string
  }
  ownerHashed?: string
  updated?: string
  autoUTMChecked: boolean
  asapStartingDate: boolean
  draftModified: boolean
  adUnitsExtended: AdUnitExtended[]
  errorsTargetURLValidations: ErrorsTargetURLValidations
}

export type ImageSizes = {
  width: number
  height: number
}

type SupplyStatsTypes =
  | 'appBannerFormats'
  | 'siteBannerFormatsDesktop'
  | 'siteBannerFormatsMobile'
  | 'appBidFloors'
  | 'siteDesktopBidFloors'
  | 'siteMobileBidFloors'

export type SupplyStatsDetails = {
  value: string
  count: number
  checked?: boolean
}

export type SupplyStats = {
  [key in SupplyStatsTypes]: SupplyStatsDetails[]
}

export type CreateCampaignType = {
  campaign: CampaignUI
  setCampaign: (val: CampaignUI | ((prevState: CampaignUI) => CampaignUI)) => void
  updateCampaign: <CampaignItemKey extends keyof CampaignUI>(
    key: CampaignItemKey,
    value: CampaignUI[CampaignItemKey]
  ) => void
  updateCampaignWithPrevStateNested: (nestedKey: string, value: any) => void
  updatePartOfCampaign: (camp: Partial<CampaignUI>) => void
  publishCampaign: () => Promise<any>
  resetCampaign: () => void
  addAdUnit: (adUnitToAdd: AdUnit) => void
  removeAdUnit: (adUnitIdToRemove: string) => void
  addTargetURLToAdUnit: (inputText: string, adUnitId: string) => void
  selectedBannerSizes: SupplyStatsDetails[] | SupplyStatsDetails[][]
  saveToDraftCampaign: (camp?: CampaignUI) => Promise<any>
  updateCampaignFromDraft: (draftCampaign: Campaign) => void
  defaultValue: CampaignUI
  addUTMToTargetURLS: () => void
  selectedBidFloors: SupplyStatsDetails[] | SupplyStatsDetails[][]
  validateAdUnitTargetURL: () => boolean
}
