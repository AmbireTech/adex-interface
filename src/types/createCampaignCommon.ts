import { Campaign } from 'adex-common/dist/types/Dsp/Campaign'
import { Banners, Devices } from './createCampaign'

export type SelectData = { value: string; label: string }

export type PaymentModelType = 'cpm' | 'cpc'

export type CampaignUI = Campaign & {
  step: number
  // TODO: make it works with DeviceType
  // devices: DeviceType[]
  devices: Devices[]
  paymentModel: PaymentModelType
  startsAt: Date | null
  endsAt: Date | null
  currency: string
  cpmMin: string
  cpmMax: string
  campaignName: string
  creativesDetails: Banners
}
