import { MantineStyleSystemProps } from '@mantine/core'
import { AdUnit, TargetingInputApplyProp } from 'adex-common/dist/types'
import { ChangeEventHandler } from 'react'

export type Devices = 'mobile' | 'desktop'

export type ErrorTargetUrl = {
  errMsg: string
  success: boolean
  isDirty: boolean
}

export type Sizes = {
  w: number
  h: number
}

export type FileWithPath = Blob & {
  lastModified: number
  name: string
  webkitRelativePath: string
  path?: string
}

export type ValidationRegExBanner = {
  [key in string]: {
    htmlTag: string
    regExp: RegExp
  }
}

export type CreateCampaignOverview = {
  title: string
  value: any
}

export type ImageUrlInputProps = MantineStyleSystemProps & {
  image: AdUnit
  toRemove?: boolean
  onDelete?: (file: AdUnit) => void
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
  preview?: boolean
  error?: ErrorTargetUrl | undefined
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
  groups: { [key: string]: string[] }
}

export type RangeTextProps = MantineStyleSystemProps & {
  labelOne: string
  valueOne: string
  labelTwo: string
  valueTwo: string
}

export type HTMLBannerDimensions = {
  width: number
  height: number
}
