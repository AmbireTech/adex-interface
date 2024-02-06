import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileWithPath, ImageSizes } from 'types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnitType } from 'adex-common/dist/types'
import {
  extractBannerDimensions,
  getFileBlobURL,
  getMediaSize,
  handleZipFile,
  readHTMLFile
} from 'helpers/createCampaignHelpers'
import { validateHTMLBanner } from 'helpers/htmlBannerValidators'

const useDropzone = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[] | null>(null)
  const updateUploadedFiles = useCallback((files: FileWithPath[]) => setUploadedFiles(files), [])
  const {
    updateCampaign,
    campaign: { adUnits }
  } = useCreateCampaignContext()

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

          reader.onload = (e: any) => {
            let htmlBannerSizes: ImageSizes | null = null
            const blobURL = getFileBlobURL(file)

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
                mime: file.type,
                mediaUrl: blobURL,
                targetUrl: '',
                created: BigInt(new Date().getTime())
              }
            }

            if (file.type === 'application/zip') {
              handleZipFile(file).then((res) => {
                const isValid = validateHTMLBanner(res as string)

                if (!isValid) {
                  console.log('Invalid HTML Banner')
                  return
                }

                htmlBannerSizes = extractBannerDimensions(res)
                if (!htmlBannerSizes) return

                adUnit.banner.format = {
                  w: htmlBannerSizes?.width,
                  h: htmlBannerSizes?.height
                }

                adUnitsCopy.push(adUnit)
                updateCampaign('adUnits', adUnitsCopy)
                updateUploadedFiles([])
              })
            } else if (file.type === 'text/html') {
              // TODO: 'text/html' should be removed because of the zip
              readHTMLFile(file).then((res) => {
                const isValid = validateHTMLBanner(res as string)

                if (!isValid) {
                  console.log('Invalid HTML Banner')
                  return
                }

                htmlBannerSizes = extractBannerDimensions(res)
                if (!htmlBannerSizes) return

                adUnit.banner.format = {
                  w: htmlBannerSizes?.width,
                  h: htmlBannerSizes?.height
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
    [updateUploadedFiles, adUnitsCopy, updateCampaign]
  )

  useEffect(() => {
    getBanners(uploadedFiles || [])
  }, [uploadedFiles, getBanners])

  return {
    onDrop
  }
}

export default useDropzone
