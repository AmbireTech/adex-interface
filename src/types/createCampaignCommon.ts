import { Bound, Campaign } from 'adex-common/dist/types/Dsp/Campaign'
import { Devices } from './createCampaign'

export type SelectData = { value: string; label: string }

export type PaymentModelType = 'cpm' | 'cpc'

export type CampaignUI = Campaign & {
  step: number
  devices: Devices[]
  paymentModel: PaymentModelType
  startsAt: Date
  endsAt: Date
  currency: string
  cpmPricingBounds: Bound
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
}
