export type Devices = 'mobile' | 'desktop'

export type BannerVariantNew = {
  width: number
  height: number
  bannerSizes: {
    w: number
    h: number
  }
  device: Devices
  checked: boolean
}

export type FileWithPath = Blob & {
  lastModified: number
  name: string
  webkitRelativePath: string
  path?: string
}
