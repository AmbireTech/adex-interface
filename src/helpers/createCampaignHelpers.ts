import { AdUnit, TargetingInputApplyProp, TargetingInputSingle } from 'adex-common/dist/types'
import { BANNER_SIZES } from 'constants/banners'
import { DEFAULT_CATS_LOCS_VALUE } from 'constants/createCampaign'
import { Devices, SelectData, ImageSizes, FileWithPath } from 'types'
import JSZip from 'jszip'
import { fetchService } from 'services'

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

export const readHTMLFile = (file: FileWithPath) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event: any) => {
      const htmlContent = event.target.result
      resolve(htmlContent)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsText(file, 'UTF-8')
  })
}
// TODO: move to the types
enum HtmlBannerType {
  Image = 'img',
  Video = 'video',
  Iframe = 'iframe'
  // Add more types as needed
}

const extractDimensionsPerHTMLBannerType = (
  htmlElement: HTMLElement,
  bannerType: HtmlBannerType
) => {
  const bannerElement = htmlElement.querySelector(bannerType)
  if (bannerElement) {
    const width = Number(bannerElement.width)
    const height = Number(bannerElement.height)

    return { width, height }
  }

  return null
}

export const extractBannerDimensions = (htmlContent: any): ImageSizes | null => {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent

  const imgElement = extractDimensionsPerHTMLBannerType(tempDiv, HtmlBannerType.Image)
  if (imgElement) return imgElement
  const videoElement = extractDimensionsPerHTMLBannerType(tempDiv, HtmlBannerType.Video)
  if (videoElement) return videoElement
  const iframeElement = extractDimensionsPerHTMLBannerType(tempDiv, HtmlBannerType.Iframe)
  if (iframeElement) return iframeElement

  return null
}

export const getFileBlobURL = (file: FileWithPath | string, fileType: string) => {
  const blob = new Blob([file], { type: fileType })
  return URL.createObjectURL(blob)
}

// TODO: move it to types
export type HTMLBannerDetails = {
  width: number
  height: number
  blobUrl: string
}

export const getHTMLBannerDetails = (htmlContent: any): Promise<HTMLBannerDetails | null> => {
  return new Promise((resolve) => {
    const tempIframe = document.createElement('iframe')
    const blobUrl = getFileBlobURL(htmlContent, 'text/html')
    tempIframe.src = blobUrl
    tempIframe.style.visibility = 'hidden'
    document.body.appendChild(tempIframe)
    tempIframe.onload = () => {
      if (!tempIframe.contentWindow?.innerWidth || !tempIframe.contentWindow?.innerHeight) {
        return resolve(null)
      }

      return resolve({
        width: tempIframe.contentWindow?.innerWidth,
        height: tempIframe.contentWindow?.innerHeight,
        blobUrl
      })
    }
  })
}

export const handleZipFile = (zipFile: FileWithPath) => {
  return new Promise((resolve, reject) => {
    const zip = new JSZip()

    zip.loadAsync(zipFile).then(
      (zipData) => {
        // Check contents or extract HTML files
        zipData.forEach((relativePath, file) => {
          // if (file.dir) {
          //   // It's a directory, handle accordingly
          //   console.log('file.dir', file.dir)
          //   // debugger // eslint-disable-line no-debugger
          // } else {
          // It's a file, check the content or process it

          if (relativePath.endsWith('.html')) {
            file.async('string').then((htmlContent) => {
              // Handle HTML content
              resolve(htmlContent)
            })
          }
          // }
        })
      },
      (error) => {
        reject(error.message)
        console.error('Error handling zip file:', error)
      }
    )
  })
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

export const uploadMedia = async (media: Blob, mediaName: string, shouldPin: boolean = false) => {
  const baseUrl = 'https://vhoda.adex.network'
  const formData = new FormData()
  formData.append('media', media, mediaName)
  formData.append('shouldPin', shouldPin.toString())
  const queryParams = {
    apiKey: 'gubitapagdokatomuviashvhod6eteboli'
  }

  const req = {
    url: `${baseUrl}/ipfs/upload`,
    method: 'POST',
    body: formData,
    queryParams
  }

  return fetchService(req).then((res) => {
    return res.json()
  })
}

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
