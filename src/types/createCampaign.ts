import { MantineStyleSystemProps } from '@mantine/core'
import { AdUnit, TargetingInputApplyProp } from 'adex-common/dist/types'
import { ChangeEventHandler } from 'react'

export type Devices = 'mobile' | 'desktop'

export type Sizes = {
  w: number
  h: number
}

export type BannerVariantNew = {
  width: number
  height: number
  bannerSizes: Sizes
  device: Devices
  checked: boolean
}

export type FileWithPath = Blob & {
  lastModified: number
  name: string
  webkitRelativePath: string
  path?: string
}

export type AllowedBannerSizes = {
  [key in Devices]: Sizes[]
}

export type ValidationRegExBanner = {
  [key in string]: {
    htmlTag: string
    regExp: RegExp
  }
}

export type CreateCampaignOverview = {
  count: number
  title: string
  value: any
}

export type ImageUrlInputProps = MantineStyleSystemProps & {
  image: AdUnit
  toRemove?: boolean
  onDelete?: (file: AdUnit) => void
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
  preview?: boolean
}

export type UploadedBannersProps = {
  updateAutoUTMChecked: (isChecked: boolean) => void
  autoUTMChecked: boolean
  onDeleteCreativeBtnClicked: (file: AdUnit) => void
  handleOnInputChange: (inputText: string, fileId: string) => void
}

export type MultiSelectAndRadioButtonsProps = {
  multiSelectData: { value: string; label: string }[]
  label: string
  defaultSelectValue?: string[]
  defaultRadioValue?: TargetingInputApplyProp
  onCategoriesChange: (selectedRadio: TargetingInputApplyProp, categories: string[]) => void
}

export type RangeTextProps = MantineStyleSystemProps & {
  labelOne: string
  valueOne: string
  labelTwo: string
  valueTwo: string
}
