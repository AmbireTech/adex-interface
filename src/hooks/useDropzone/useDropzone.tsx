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
  const updateUploadedFiles = useCallback((files: FileWithPath[]) => setUploadedFiles(files), [])
  const {
    updateCampaign,
    campaign: { adUnits }
  } = useCreateCampaignContext()
  const { uploadMedia, uploadZipMedia } = useMediaUpload()

  const adUnitsCopy = useMemo(() => [...adUnits], [adUnits])

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
            if (file.type === 'application/zip') {
              response = await uploadZipMedia(blob, file.name).catch((error) =>
                console.error('ERROR: ', error)
              )
            } else {
              response = await uploadMedia(blob, file.name).catch((error) =>
                console.error('ERROR: ', error)
              )
            }
            if (!response) {
              console.error(response.error)
              return
            }
            const ipfsUrl = response?.root ? response.root.ipfsUrl : response.ipfsUrl

            let htmlBannerSizes: ImageSizes | null = null
            const adUnit = {
              // TODO: Change the id because if drops more than one file it generate duplicate ids
              id: new Date().getTime().toString(),
              title: file.name,
              type: AdUnitType.Banner,
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
                updateCampaign('adUnits', adUnitsCopy)
                updateUploadedFiles([])
              })
            } else {
              getMediaSize(file.type, e.target.result).then((sizes) => {
                htmlBannerSizes = sizes
                adUnit.banner.format = { w: htmlBannerSizes?.width, h: htmlBannerSizes?.height }

                adUnitsCopy.push(adUnit)
                updateCampaign('adUnits', adUnitsCopy)
                updateUploadedFiles([])
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
