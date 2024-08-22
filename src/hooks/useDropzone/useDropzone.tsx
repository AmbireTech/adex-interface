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
    // updateCampaign,
    form
  } = useCreateCampaignContext()
  const { uploadMedia, uploadZipMedia } = useMediaUpload()

  const onDrop = useCallback(
    (files: FileWithPath[] | null) => {
      if (files === null) return
      setUploadedFiles(files)
    },
    [setUploadedFiles]
  )

  const getAdUnitFromFile = useCallback(
    async (file: FileWithPath): Promise<AdUnit> => {
      try {
        const blob = new Blob([file], { type: file.type })
        let ipfsUrl: string = ''
        if (file.type === 'application/zip') {
          ipfsUrl = (await uploadZipMedia(blob, file.name))?.root.ipfsUrl
        } else {
          ipfsUrl = (await uploadMedia(blob, file.name))?.ipfsUrl
        }

        if (!ipfsUrl) {
          console.error('Failed to upload to ipfs')
          throw new Error('Failed to upload to ipfs')
        }

        const adUnit = {
          // TODO: unit id
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

        let result: HTMLBannerDimensions | ImageSizes | null
        const mediaUrlWithProv = getMediaUrlWithProvider(ipfsUrl, IPFS_GATEWAY)
        if (file.type === 'application/zip') {
          result = await getHTMLBannerDimensions(mediaUrlWithProv)

          if (!result) {
            throw new Error('Failed getting dimensions')
          }

          adUnit.banner.format = {
            w: Number(result.width),
            h: Number(result.height)
          }
        } else {
          result = await getMediaSize(file.type, mediaUrlWithProv)
          if (!result) {
            throw new Error('Failed getting dimensions')
          }
          adUnit.banner.format = { w: result.width, h: result.height }
        }

        return adUnit
      } catch (error: any) {
        console.error('ERROR processing media:', error)
        throw new Error(`ERROR processing media: ${error?.message || error}`)
      }
    },
    [uploadMedia, uploadZipMedia]
  )

  const getBanners = useCallback(
    async (files: FileWithPath[]) => {
      if (!files || files.length === 0) return

      const newFiles = files.filter((x) => {
        const isAlradyUploaded = adUnits.some((u) => u.title === x.name)
        isAlradyUploaded && showNotification('info', 'Already uploaded!', x.name)
        return !isAlradyUploaded
      })

      console.log({ newFiles })

      try {
        const adUnitsToAdd: AdUnit[] = await Promise.all(
          newFiles.map((file: FileWithPath) => getAdUnitFromFile(file))
        )

        adUnitsToAdd.forEach((u) => form.insertListItem('adUnits', u))

        // const updatedAdUnits = adUnits.concat(adUnitsToAdd)
        // adUnitsToAdd.length && updateCampaign({ adUnits: updatedAdUnits }, true)
      } catch (err: any) {
        console.error('ERROR in getBanners: ', err)
        showNotification('error', `Failed to upload creative: ${err.message || err}`)
      }

      setIsLoading(false)
      setUploadedFiles(null)
    },
    [adUnits, showNotification, getAdUnitFromFile, form]
  )

  useEffect(() => {
    if (uploadedFiles) {
      setIsLoading(true)
      getBanners(uploadedFiles)
    }
  }, [uploadedFiles, getBanners])

  return {
    onDrop,
    isLoading
  }
}

export default useDropzone
