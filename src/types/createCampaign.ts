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
  mediumRectangle: BannerDetails | null
  skyscraper: BannerDetails | null
  leaderboard: BannerDetails | null
  billboard: BannerDetails | null
  halfPage: BannerDetails | null
  mobileBanner: BannerDetails | null
  mobileLeaderboard: BannerDetails | null
  others: BannerDetails
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
  fileDetails: FileWithPath[]
}
