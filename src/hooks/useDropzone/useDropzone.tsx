import { useCallback, useEffect, useState } from 'react'
import { HTMLBannerDimensions, ImageSizes } from 'types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnit, AdUnitType } from 'adex-common/dist/types'
import {
  getHTMLBannerDimensions,
  getMediaSize,
  getMediaUrlWithProvider,
  isVideoMedia
} from 'helpers/createCampaignHelpers'
import { FileWithPath } from '@mantine/dropzone'
import useMediaUpload from 'hooks/useMediaUpload'
import useCustomNotifications from 'hooks/useCustomNotifications'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY || ''

const useDropzone = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { showNotification } = useCustomNotifications()

  const {
    campaign: { adUnits },
    updateCampaign
  } = useCreateCampaignContext()
  const { uploadMedia, uploadZipMedia } = useMediaUpload()

  const onDrop = useCallback(
    (files: FileWithPath[] | null) => {
      if (files === null) return
      setUploadedFiles(files)
    },
    [setUploadedFiles]
  )

  const getBanners = useCallback(
    async (files: FileWithPath[]) => {
      if (!files || files.length === 0) return

      setIsLoading(true)

      const adUnitsToAdd: AdUnit[] = []

      try {
        await Promise.all(
          files.map((file: FileWithPath) => {
            return new Promise<void>((resolve, reject) => {
              const reader = new FileReader()

              reader.onload = async (e: ProgressEvent<FileReader>) => {
                const blob = new Blob([file], { type: file.type })
                let response
                let ipfsUrl: string = ''

                try {
                  if (file.type === 'application/zip') {
                    response = await uploadZipMedia(blob, file.name)
                    ipfsUrl = response?.root.ipfsUrl
                  } else {
                    response = await uploadMedia(blob, file.name)
                    ipfsUrl = response?.ipfsUrl
                  }

                  if (!response || !ipfsUrl) {
                    console.error('No Response')
                    reject(new Error('No Response'))
                    return
                  }
                } catch (err: any) {
                  console.error('ERROR during upload: ', err)
                  reject(new Error(`ERROR during upload: ${err.message || err}`))
                  return
                }

                const adUnit = {
                  id: `${file.name.replace(/\s+/g, '')}-${Date.now().toString(16)}`,
                  title: file.name,
                  type: isVideoMedia(file.type) ? AdUnitType.Video : AdUnitType.Banner,
                  banner: {
                    format: {
                      w: 0,
                      h: 0
                    },
                    mime: file.type === 'application/zip' ? 'text/html' : file.type,
                    mediaUrl: ipfsUrl,
                    targetUrl: '',
                    created: BigInt(new Date().getTime())
                  }
                }

                try {
                  let result: HTMLBannerDimensions | ImageSizes | null
                  if (file.type === 'application/zip') {
                    const mediaUrlWithProv = getMediaUrlWithProvider(ipfsUrl, IPFS_GATEWAY)
                    result = await getHTMLBannerDimensions(mediaUrlWithProv)

                    if (!result) {
                      throw new Error('Failed getting dimensions')
                    }

                    adUnit.banner.format = {
                      w: Number(result.width),
                      h: Number(result.height)
                    }
                  } else {
                    result = await getMediaSize(file.type, e.target?.result as string)
                    if (!result) {
                      throw new Error('Failed getting dimensions')
                    }
                    adUnit.banner.format = { w: result.width, h: result.height }
                  }

                  adUnitsToAdd.push(adUnit)
                  resolve()
                } catch (err: any) {
                  console.error('ERROR getting dimensions: ', err)
                  reject(new Error(`ERROR getting dimensions: ${err.message || err}`))
                }
              }

              reader.onerror = () => {
                reject(new Error('File reading failed'))
              }

              reader.readAsDataURL(file)
            })
          })
        )

        const updatedAdUnits = adUnits.concat(adUnitsToAdd)
        adUnitsToAdd.length && updateCampaign({ adUnits: updatedAdUnits })
      } catch (err: any) {
        console.error('ERROR in getBanners: ', err)
        showNotification('error', `Failed to upload creative: ${err.message || err}`)
      } finally {
        setIsLoading(false)
      }

      setUploadedFiles(null)
    },
    [uploadZipMedia, uploadMedia, updateCampaign, adUnits, showNotification]
  )

  useEffect(() => {
    if (uploadedFiles) {
      getBanners(uploadedFiles)
    }
  }, [uploadedFiles, getBanners])

  return {
    onDrop,
    isLoading
  }
}

export default useDropzone
