import { Banner } from 'adex-common/dist/types'
import { AllowedBannerSizes, BannerVariantNew } from 'types'

export const BANNER_SIZES: BannerVariantNew[] = [
  {
    width: 21,
    height: 17,
    bannerSizes: { w: 300, h: 250 },
    device: 'mobile',
    checked: false
  },
  {
    width: 11,
    height: 39,
    bannerSizes: { w: 160, h: 600 },
    device: 'desktop',
    checked: false
  },
  {
    width: 57,
    height: 8,
    bannerSizes: { w: 728, h: 90 },
    device: 'desktop',
    checked: false
  },
  {
    width: 62,
    height: 17,
    bannerSizes: { w: 970, h: 250 },
    device: 'desktop',
    checked: false
  },
  {
    width: 21,
    height: 41,
    bannerSizes: { w: 300, h: 600 },
    device: 'desktop',
    checked: false
  },
  {
    width: 52,
    height: 8,
    bannerSizes: { w: 300, h: 50 },
    device: 'mobile',
    checked: false
  },
  {
    width: 57,
    height: 8,
    bannerSizes: { w: 320, h: 50 },
    device: 'mobile',
    checked: false
  }
]

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

export const ALLOWED_BANNER_SIZES: AllowedBannerSizes = {
  mobile: [
    { w: 300, h: 250 },
    { w: 300, h: 50 },
    { w: 320, h: 50 }
  ],
  desktop: [
    { w: 160, h: 600 },
    { w: 728, h: 90 },
    { w: 970, h: 250 },
    { w: 300, h: 600 }
  ]
}
