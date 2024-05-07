import { useCallback, useEffect, useMemo, useState } from 'react'
import { HTMLBannerDimensions, ImageSizes } from 'types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnitType } from 'adex-common/dist/types'
import {
  getHTMLBannerDimensions,
  getMediaSize,
  getMediaUrlWithProvider
} from 'helpers/createCampaignHelpers'
// import { validateHTMLBanner } from 'helpers/htmlBannerValidators'
import { FileWithPath } from '@mantine/dropzone'
import useMediaUpload from 'hooks/useMediaUpload'

const IPFS_GATEWAY = process.env.REACT_APP_IPFS_GATEWAY

const useDropzone = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[] | null>(null)
  const updateUploadedFiles = useCallback(
    (files: FileWithPath[] | null) => setUploadedFiles(files),
    []
  )
  const {
    updateCampaign,
    campaign: { adUnitsExtended }
  } = useCreateCampaignContext()
  const { uploadMedia, uploadZipMedia } = useMediaUpload()

  const adUnitsCopy = useMemo(() => [...adUnitsExtended], [adUnitsExtended])

  const onDrop = useCallback(
    (files: FileWithPath[] | null) => {
      if (files === null) return
      updateUploadedFiles(files)
    },
    [updateUploadedFiles]
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

            let htmlBannerSizes: ImageSizes | null = null
            const adUnit = {
              id: `${file.name.replace(/\s+/g, '')}-${Date.now().toString(16)}`,
              title: file.name,
              type: AdUnitType.Banner,
              error: '',
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

            if (file.type === 'application/zip') {
              const mdeiaUrlWithProv = getMediaUrlWithProvider(ipfsUrl, IPFS_GATEWAY)

              getHTMLBannerDimensions(mdeiaUrlWithProv).then((res: HTMLBannerDimensions | null) => {
                if (!res) {
                  return console.error('Failed getting dimensions')
                }

                adUnit.banner.format = {
                  w: Number(res.width),
                  h: Number(res.height)
                }

                adUnitsCopy.push(adUnit)
                updateCampaign('adUnitsExtended', adUnitsCopy)
                updateUploadedFiles(null)
              })
            } else {
              getMediaSize(file.type, e.target.result).then((sizes) => {
                htmlBannerSizes = sizes
                adUnit.banner.format = { w: htmlBannerSizes?.width, h: htmlBannerSizes?.height }

                adUnitsCopy.push(adUnit)
                updateCampaign('adUnitsExtended', adUnitsCopy)
                updateUploadedFiles(null)
              })
            }
          }
          reader.readAsDataURL(file)
        })
    },
    [updateUploadedFiles, adUnitsCopy, updateCampaign, uploadMedia, uploadZipMedia]
  )

  useEffect(() => {
    getBanners(uploadedFiles || [])
  }, [uploadedFiles, getBanners])

  return {
    onDrop
  }
}

export default useDropzone
