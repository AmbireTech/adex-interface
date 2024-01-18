import { AdUnit } from 'adex-common/dist/types'

export type Devices = 'mobile' | 'desktop'
export type ShapeVariants =
  | 'mediumRectangle'
  | 'skyscraper'
  | 'leaderboard'
  | 'billboard'
  | 'halfPage'
  | 'mobileBanner'
  | 'mobileLeaderboard'

export type BannerVariant = {
  label: ShapeVariants
  width: number
  height: number
  bannerSizes: string
  bannerName: string
  checked: boolean
}

export type ImagesInfo = {
  width: number
  height: number
  isValid: boolean
  variant: Record<string, BannerVariant>
}

export type Banners = {
  [key: string]: BannerDetails | null
}

export type TabSwitchDevices = {
  imagesInfo: Banners | null
}

export type FileWithPath = Blob & {
  lastModified: number
  name: string
  webkitRelativePath: string
  path?: string
}

export type BannerDetails = {
  details?: BannerVariant
  adUnits: AdUnit[]
}
