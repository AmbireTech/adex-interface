import { useCallback, useEffect, useState } from 'react'
import { HTMLBannerDimensions, ImageSizes } from 'types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnitType } from 'adex-common/dist/types'
import {
  getHTMLBannerDimensions,
  getMediaSize,
  getMediaUrlWithProvider,
  isVideoMedia
} from 'helpers/createCampaignHelpers'
// import { validateHTMLBanner } from 'helpers/htmlBannerValidators'
import { FileWithPath } from '@mantine/dropzone'
import useMediaUpload from 'hooks/useMediaUpload'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useDropzone = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[] | null>(null)
  const { addAdUnit } = useCreateCampaignContext()
  const { uploadMedia, uploadZipMedia } = useMediaUpload()

  const onDrop = useCallback(
    (files: FileWithPath[] | null) => {
      if (files === null) return
      setUploadedFiles(files)
    },
    [setUploadedFiles]
  )

  const getBanners = useCallback(
    (files: FileWithPath[]) => {
      files &&
        files.forEach((file: FileWithPath) => {
          const reader = new FileReader()

          reader.onload = async (e: any) => {
            const blob = new Blob([file], { type: file.type })
            let response
            let ipfsUrl: string = ''
            try {
              if (file.type === 'application/zip') {
                response = await uploadZipMedia(blob, file.name)
                ipfsUrl = response.root.ipfsUrl
              } else {
                response = await uploadMedia(blob, file.name)
                ipfsUrl = response.ipfsUrl
              }
              if (!response) {
                console.error('No Response')
                return
              }
            } catch (err) {
              console.error('ERROR: ', err)
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
            let result: HTMLBannerDimensions | ImageSizes | null
            try {
              if (file.type === 'application/zip') {
                const mdeiaUrlWithProv = getMediaUrlWithProvider(ipfsUrl, IPFS_GATEWAY)

                result = await getHTMLBannerDimensions(mdeiaUrlWithProv)
                if (!result) {
                  throw new Error('Failed getting dimensions')
                }

                adUnit.banner.format = {
                  w: Number(result.width),
                  h: Number(result.height)
                }
              } else {
                result = await getMediaSize(file.type, e.target.result)
                if (!result) {
                  throw new Error('Failed getting dimensions')
                }
                adUnit.banner.format = { w: result.width, h: result.height }
              }
              addAdUnit(adUnit)
            } catch (err) {
              console.error('ERROR: ', err)
            }
          }
          reader.readAsDataURL(file)
        })
      setUploadedFiles(null)
    },
    [setUploadedFiles, addAdUnit, uploadMedia, uploadZipMedia]
  )

  useEffect(() => {
    getBanners(uploadedFiles || [])
  }, [uploadedFiles, getBanners])

  return {
    onDrop
  }
}

export default useDropzone
