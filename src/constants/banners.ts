import { Banner } from 'adex-common/dist/types'

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
