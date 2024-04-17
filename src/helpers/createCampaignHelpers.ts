import { AdUnit, TargetingInputApplyProp, TargetingInputSingle } from 'adex-common/dist/types'
import { BANNER_SIZES } from 'constants/banners'
import { DEFAULT_CATS_LOCS_VALUE } from 'constants/createCampaign'
import { Campaign } from 'adex-common'
import {
  Devices,
  SelectData,
  ImageSizes,
  FileWithPath,
  HTMLBannerDimensions,
  CampaignUI
} from 'types'

export const checkSelectedDevices = (devices: Devices[]) => {
  if (devices.length === 1) {
    if (devices.includes('mobile')) return 'mobile'
    if (devices.includes('desktop')) return 'desktop'
  }
  if (devices.length === 2) return 'both'
  return null
}

export const formatCatsAndLocsData = (inputValues: TargetingInputSingle, lib: SelectData[]) => {
  const selectedCats = Object.entries(inputValues).find(
    ([, value]) => Array.isArray(value) && value.length > 0
  )

  if (inputValues.apply === 'all' && typeof selectedCats === 'undefined') return ['all', null]

  if (!selectedCats) return [null, null]
  const [key, values] = selectedCats

  const labels = lib
    .map((item) => (!!values.length && values.includes(item.value) ? item.label : null))
    .filter((x) => !!x)
    .join(', ')

  return [key, labels]
}

export const updateCatsLocsObject = (selectedRadio: TargetingInputApplyProp, values: string[]) => {
  // const updated = { ...DEFAULT_CATS_LOCS_VALUE }
  const updated = structuredClone(DEFAULT_CATS_LOCS_VALUE)
  if (selectedRadio !== 'all') {
    updated[selectedRadio] = values
    updated.apply = selectedRadio
  }
  return updated
}

export const findArrayWithLengthInObjectAsValue = (obj: object) =>
  Object.entries(obj).find(([, value]) => Array.isArray(value) && value.length > 0)

export const checkBannerSizes = (adUnits: AdUnit[]) =>
  BANNER_SIZES.map((item) => {
    const copy = { ...item }
    adUnits.forEach((adUnit) => {
      if (
        adUnit.banner?.format.w === item.bannerSizes.w &&
        adUnit.banner?.format.h === item.bannerSizes.h
      )
        copy.checked = true
    })

    return copy
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

        const dimensions = {
          width: iframeDocument.body.scrollWidth,
          height: iframeDocument.body.scrollHeight
        }

        document.body.removeChild(tempIframe)

        resolve(dimensions)
      }
      tempIframe.onerror = (error) => {
        document.body.removeChild(tempIframe)

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

type ReducedCampaign = Omit<
  Campaign,
  | 'created'
  | 'owner'
  | 'validators'
  | 'targetingRules'
  | 'status'
  | 'reviewStatus'
  | 'modified'
  | 'archived'
  | 'createdBy'
  | 'lastModifiedBy'
>

export const mapCampaignUItoCampaign = (campaignUI: CampaignUI): ReducedCampaign => {
  const {
    step,
    devices,
    paymentModel,
    startsAt,
    endsAt,
    currency,
    created,
    owner,
    validators,
    targetingRules,
    status,
    reviewStatus,
    modified,
    archived,
    createdBy,
    lastModifiedBy,
    ...campaign
  } = campaignUI

  return {
    ...campaign
  }
}
