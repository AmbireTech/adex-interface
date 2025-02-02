import { Campaign } from 'adex-common/dist/types/Dsp/Campaign'
import { Alpha3Code } from 'adex-common'
import { UseFormReturnType } from '@mantine/form'
import { Devices } from './createCampaign'

export type SelectData = { value: string | Alpha3Code; label: string; group?: string }

export type PaymentModelType = 'cpm' | 'cpc'

export type CampaignUI = Campaign & {
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
  budget: number
}

export type ImageSizes = {
  width: number
  height: number
}

export type CreateCampaignType = {
  step: number
  nextStep: () => void
  prevStep: () => void
  // stepsCount: number
  campaign: CampaignUI
  publishCampaign: (onSuccess?: () => void) => Promise<any>
  resetCampaign: (reasonMsg?: string, onReset?: () => void) => void
  allowedBannerSizes: string[]
  saveToDraftCampaign: () => Promise<void>
  updateCampaignFromDraft: (draftCampaign: Campaign, isClone?: boolean) => void
  defaultValue: CampaignUI
  addUTMToTargetURLS: () => void
  form: UseFormReturnType<CampaignUI>
}
