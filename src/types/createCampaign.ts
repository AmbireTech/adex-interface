export type Devices = 'mobile' | 'desktop'

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
  isColumn?: boolean
}

export type RangeTextProps = {
  labelOne: string
  valueOne: string
  labelTwo: string
  valueTwo: string
}

export type HTMLBannerDimensions = {
  width: number
  height: number
}
