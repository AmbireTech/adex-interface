import { Campaign } from 'adex-common'
import {
  Devices,
  ImageSizes,
  FileWithPath,
  HTMLBannerDimensions,
  SupplyStats,
  SupplyStatsDetails
} from 'types'

export const checkSelectedDevices = (devices: Devices[]) => {
  if (!devices.length) return null
  if (devices.length === 1) {
    return devices[0]
  }
  if (devices.length === 2) return 'both'
}

export const findArrayWithLengthInObjectAsValue = (obj: object) =>
  Object.entries(obj).find(([, value]) => Array.isArray(value) && value.length > 0)

export const selectBannerSizes = (
  supplyStats: SupplyStats
): Record<string, SupplyStatsDetails[][]> => ({
  app: [supplyStats.appBannerFormats, supplyStats.appBidFloors],
  mobile: [supplyStats.siteBannerFormatsMobile, supplyStats.siteMobileBidFloors],
  desktop: [supplyStats.siteBannerFormatsDesktop, supplyStats.siteDesktopBidFloors]
})

export const findDuplicates = (array: string[]) => {
  const countMap: any = {}
  const uniqueValues: string[] = []

  array.forEach((value: string) => {
    if (countMap[value]) {
      countMap[value]++
    } else {
      countMap[value] = 1
      uniqueValues.push(value)
    }
  })

  const result = uniqueValues.map((value) => ({
    value,
    count: countMap[value]
  }))

  return result
}

export const getFileBlobURL = (file: FileWithPath | string, fileType: string) => {
  const blob = new Blob([file], { type: fileType })
  return URL.createObjectURL(blob)
}

export const getHTMLBannerDimensions = async (
  ipfsUrl: string
): Promise<HTMLBannerDimensions | null> => {
  try {
    const response = await fetch(ipfsUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch HTML content (status ${response.status})`)
    }

    const html = await response.text()
    const blobUrl = getFileBlobURL(html, 'text/html')
    const tempIframe = document.createElement('iframe')
    tempIframe.src = blobUrl
    tempIframe.style.visibility = 'hidden'
    tempIframe.style.position = 'absolute' // Ensure iframe is not affecting layout
    tempIframe.style.top = '-9999px' // Move iframe off-screen
    document.body.appendChild(tempIframe)

    return await new Promise<HTMLBannerDimensions>((resolve, reject) => {
      tempIframe.onload = () => {
        const iframeDocument = tempIframe.contentDocument || tempIframe.contentWindow?.document
        if (!iframeDocument) {
          reject(new Error('Failed to get iframe document'))
          return
        }

        // NOTE: we need meta tag in this format - add it to help center and info in the upload menu
        // <meta name="ad.size" content="width=320,height=50">

        // @ts-ignore
        const sizeContent = iframeDocument.head.querySelector('meta[name="ad.size"]')?.content || ''
        const match = sizeContent.match(/width=([0-9]+),height=([0-9]+)/)

        if (
          !match ||
          !match[1] ||
          !match[2] ||
          Number.isInteger(match[1]) ||
          Number.isInteger(match[2])
        ) {
          throw new Error(
            'Invalid html banner - missing ad size meta tag in format <meta name="ad.size" content="width=320,height=50">'
          )
        }

        const dimensions = {
          width: Number(match[1]),
          height: Number(match[2])
        }

        document.body.removeChild(tempIframe)
        URL.revokeObjectURL(blobUrl)
        resolve(dimensions)
      }
      tempIframe.onerror = (error) => {
        console.log(error)
        document.body.removeChild(tempIframe)
        URL.revokeObjectURL(blobUrl)
        reject(error)
      }
    })
  } catch (error) {
    console.error('Error fetching HTML banner dimensions:', error)
    return null
  }
}

export const isVideoMedia = (mime: string = '') => mime.split('/')[0] === 'video'

const getVideoSize = (src: string): Promise<ImageSizes> =>
  new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = src

    video.onloadedmetadata = (res: Event) => {
      const target = res.target as HTMLVideoElement
      if (target === null) return reject(console.log('invalid Video'))
      return resolve({
        width: target.videoWidth || 0,
        height: target.videoHeight || 0
      })
    }
  })

const getImageSize = (src: string): Promise<ImageSizes> =>
  new Promise((resolve) => {
    const image = new Image()
    image.src = src
    image.onload = () => {
      return resolve({
        width: image.width,
        height: image.height
      })
    }
  })

export const getMediaSize = (mime: string, src: string) =>
  isVideoMedia(mime) ? getVideoSize(src) : getImageSize(src)

export const getMediaUrlWithProvider = (mediaUrl = 'ipfs://', provider = '') => {
  if (mediaUrl.startsWith('ipfs://')) return provider + mediaUrl.substring(7)
  return mediaUrl
}

export const initAllLocales = () => {
  const locales = (require as any).context('dayjs/locale', true, /\.js$/)
  const allLocales: Record<string, any> = locales.keys().reduce((acc: any, fileName: any) => {
    const localeName = fileName.replace(/^.\/(.*).js$/, '$1')
    const localeModule = locales(fileName)
    acc[localeName] = localeModule.default || localeModule
    return acc
  }, {})
  return allLocales
}

export function deepEqual<T>(obj1: T, obj2: T): boolean {
  if (obj1 === obj2) return true

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1 as any)
  const keys2 = Object.keys(obj2 as any)

  if (keys1.length !== keys2.length) return false

  return keys1.every(
    (key) => keys2.includes(key) && deepEqual((obj1 as any)[key], (obj2 as any)[key])
  )
}

const UTM_PARAMS = {
  utm_source: 'AdEx',
  // utm_medium: '', // NOTE: utm_medium will be appended at BE
  utm_term: '',
  utm_campaign: '',
  utm_content: ''
}

export const addUrlUtmTracking = ({
  targetUrl,
  campaign,
  content,
  term
}: {
  targetUrl: string
  campaign: string
  content: string
  term: string
}) => {
  if (targetUrl) {
    const url = new URL(targetUrl)
    const params = new URLSearchParams(url.search)

    Object.entries(UTM_PARAMS).forEach(([key, value]) => {
      let paramValue = ''
      switch (key) {
        case 'utm_campaign':
          paramValue = params.get('utm_campaign') || campaign
          break
        case 'utm_content':
          paramValue = params.get('utm_content') || content
          break
        case 'utm_term':
          paramValue = params.get('utm_term') || term
          break
        default:
          paramValue = params.get(key) || value
          break
      }

      params.set(key, paramValue)
    })

    const search = Array.from(params.entries())
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    url.search = search
    return url.toString()
  }

  return targetUrl
}

export const hasUtmCampaign = (url: string) => {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.has('utm_campaign')
  } catch (e) {
    console.error('Invalid URL:', e)
    return false
  }
}

export const parseRange = (str: string): { min: number; max: number } => {
  const pattern = /^(\d+)_(\d+)-(\d+)_(\d+)$/
  const match = str.match(pattern)

  // if (!match) {
  //   throw new Error('Invalid input format. Expected format: "0_20-0_30"')
  // }

  const min = parseFloat(`${match?.[1]}.${match?.[2]}`)
  const max = parseFloat(`${match?.[3]}.${match?.[4]}`)

  return { min, max }
}

export const getRecommendedCPMRange = (supplyStats: SupplyStats, campaign: Campaign) => {
  if (!supplyStats || !campaign) {
    return { min: 0, max: 0 }
  }
  const mostRequests = campaign.targetingInput.inputs.placements.in
    .map((placement) => {
      switch (placement) {
        case 'app':
          return supplyStats.appBidFloors

        case 'site':
          return [...supplyStats.siteDesktopBidFloors, ...supplyStats.siteMobileBidFloors]
        default:
          return []
      }
    })
    .flat()
    .sort((a, b) => b.count - a.count)?.[0]

  return {
    ...parseRange(mostRequests?.value || '0_42-0_69')
  }
}
