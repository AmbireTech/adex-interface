import { MantineStyleSystemProps } from '@mantine/core'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import { ChangeEventHandler } from 'react'
import { AdUnitExtended } from './createCampaignCommon'

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
  count: number
  title: string
  value: any
}

export type ImageUrlInputProps = MantineStyleSystemProps & {
  image: AdUnitExtended
  toRemove?: boolean
  onDelete?: (file: AdUnitExtended) => void
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined
  preview?: boolean
}

export type UploadedBannersProps = {
  updateAutoUTMChecked: (isChecked: boolean) => void
  autoUTMChecked: boolean
  onDeleteCreativeBtnClicked: (file: AdUnitExtended) => void
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
