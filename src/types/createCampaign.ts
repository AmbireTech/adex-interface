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
