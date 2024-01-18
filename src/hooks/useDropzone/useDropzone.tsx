import { useCallback, useEffect, useState } from 'react'
import { BannerVariant, Banners, FileWithPath } from 'types'
import { BANNER_VARIANTS } from 'constants/banners'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnitType } from 'adex-common/dist/types'

type UseDropzoneProps = {
  defaultBannersValue: Banners
}

const useDropzone = ({ defaultBannersValue }: UseDropzoneProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[] | null>(null)
  const updateUploadedFiles = useCallback((files: FileWithPath[]) => setUploadedFiles(files), [])
  const { updateCampaignAdUnits } = useCreateCampaignContext()

  const updateBanners = useCallback(
    (updatedValues: Banners) => {
      updateCampaignAdUnits(updatedValues)
    },
    [updateCampaignAdUnits]
  )

  const onDrop = useCallback(
    (files: FileWithPath[] | null) => {
      if (files === null) return
      updateUploadedFiles(files)
    },
    [updateUploadedFiles]
  )

  const getBanners = useCallback(
    (files: FileWithPath[]) => {
      const bannersDefaultValue: Banners = defaultBannersValue

      const variantKeys = Object.keys(BANNER_VARIANTS)

      files &&
        files.forEach((file: FileWithPath) => {
          const reader = new FileReader()
          let matchedVariant: BannerVariant | null = null

          reader.onload = (e: any) => {
            const img = new Image()
            img.src = e.target.result
            const base64StringUS = e.target.result.replace('data:', '').replace(/^.+,/, '')

            img.onload = () => {
              const width = img.width
              const height = img.height
              const adUnit = {
                id: new Date().getTime().toString(),
                title: file.name,
                type: AdUnitType.Banner,
                banner: {
                  format: {
                    w: width,
                    h: height
                  },
                  mime: '',
                  mediaUrl: base64StringUS,
                  targetUrl: '',
                  created: BigInt(new Date().getTime())
                }
              }

              for (let i = 0; i < variantKeys.length; i += 1) {
                const variant = BANNER_VARIANTS[variantKeys[i]]
                matchedVariant = variant
                if (variant.bannerSizes === `${width}x${height}`) {
                  matchedVariant.checked = true
                  bannersDefaultValue[matchedVariant!.label]!.adUnits.push(adUnit)
                  break
                }
              }
              if (!matchedVariant?.checked) {
                bannersDefaultValue.others?.adUnits.push(adUnit)
              }

              updateBanners(bannersDefaultValue)
              updateUploadedFiles([])
            }
          }
          reader.readAsDataURL(file)
        })
    },
    [updateBanners, defaultBannersValue, updateUploadedFiles]
  )

  useEffect(() => {
    getBanners(uploadedFiles || [])
  }, [uploadedFiles, getBanners])

  return {
    onDrop
  }
}

export default useDropzone
