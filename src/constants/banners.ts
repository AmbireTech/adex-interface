import { BannerVariant } from 'types'

export const BANNER_VARIANTS: { [key: string]: BannerVariant } = {
  mediumRectangle: {
    label: 'mediumRectangle',
    width: 32,
    height: 26,
    bannerSizes: '300x250',
    bannerName: 'Medium rectangle',
    checked: false
  },
  skyscraper: {
    label: 'skyscraper',
    width: 16,
    height: 60,
    bannerSizes: '160x600',
    bannerName: 'Skyscraper',
    checked: false
  },
  leaderboard: {
    label: 'leaderboard',
    width: 88,
    height: 12,
    bannerSizes: '728x90',
    bannerName: 'Leaderboard',
    checked: false
  },
  billboard: {
    label: 'billboard',
    width: 96,
    height: 27,
    bannerSizes: '970x250',
    bannerName: 'Billboard',
    checked: false
  },
  halfPage: {
    label: 'halfPage',
    width: 32,
    height: 64,
    bannerSizes: '300x600',
    bannerName: 'Half Page',
    checked: false
  },
  mobileBanner: {
    label: 'mobileBanner',
    width: 86,
    height: 14,
    bannerSizes: '300x50',
    bannerName: 'Mobile Banner',
    checked: false
  },
  mobileLeaderboard: {
    label: 'mobileLeaderboard',
    width: 90,
    height: 14,
    bannerSizes: '320x50',
    bannerName: 'Mobile Leaderboard',
    checked: false
  }
}
