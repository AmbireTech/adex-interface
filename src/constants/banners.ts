import { Banner } from 'adex-common/dist/types'
import { BannerVariant } from 'types'

export const BANNER_VARIANTS: { [key: string]: BannerVariant } = {
  mediumRectangle: {
    label: 'mediumRectangle',
    width: 21,
    height: 17,
    bannerSizes: '300x250',
    bannerName: 'Medium rectangle',
    checked: false
  },
  skyscraper: {
    label: 'skyscraper',
    width: 11,
    height: 39,
    bannerSizes: '160x600',
    bannerName: 'Skyscraper',
    checked: false
  },
  leaderboard: {
    label: 'leaderboard',
    width: 57,
    height: 8,
    bannerSizes: '728x90',
    bannerName: 'Leaderboard',
    checked: false
  },
  billboard: {
    label: 'billboard',
    width: 62,
    height: 17,
    bannerSizes: '970x250',
    bannerName: 'Billboard',
    checked: false
  },
  halfPage: {
    label: 'halfPage',
    width: 21,
    height: 41,
    bannerSizes: '300x600',
    bannerName: 'Half Page',
    checked: false
  },
  mobileBanner: {
    label: 'mobileBanner',
    width: 52,
    height: 8,
    bannerSizes: '300x50',
    bannerName: 'Mobile Banner',
    checked: false
  },
  mobileLeaderboard: {
    label: 'mobileLeaderboard',
    width: 57,
    height: 8,
    bannerSizes: '320x50',
    bannerName: 'Mobile Leaderboard',
    checked: false
  }
}

export const BANNER_DEFAULT_VALUE: Banner = {
  format: {
    w: 0,
    h: 0
  },
  mime: '',
  mediaUrl: '',
  targetUrl: '',
  created: BigInt(new Date().getTime())
}
