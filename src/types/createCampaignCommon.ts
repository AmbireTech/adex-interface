import { AdUnit, Campaign } from 'adex-common/dist/types/Dsp/Campaign'
import { Alpha3Code } from 'adex-common'
import { Devices } from './createCampaign'

export type SelectData = { value: string | Alpha3Code; label: string }

export type PaymentModelType = 'cpm' | 'cpc'

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
}

export type ImageSizes = {
  width: number
  height: number
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
}
