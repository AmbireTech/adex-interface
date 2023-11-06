import { useCallback, useEffect, useState } from 'react'
import { BannerVariant, Banners, FileWithPath } from 'types'
import { BANNER_VARIANTS } from 'constants/banners'

type UseDropzoneProps = {
  updateBanners: (updatedValues: Banners) => void
}

const useDropzone = ({ updateBanners }: UseDropzoneProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPath[] | null>(null)
  const updateUploadedFiles = useCallback((files: FileWithPath[]) => setUploadedFiles(files), [])

  const onDrop = useCallback(
    (files: FileWithPath[] | null) => {
      if (files === null) return
      updateUploadedFiles(files)
    },
    [updateUploadedFiles]
  )

  const getBanners = useCallback(
    (files: FileWithPath[]) => {
      const bannersDefaultValue: Banners = {
        mediumRectangle: { details: BANNER_VARIANTS.mediumRectangle, fileDetails: [] },
        skyscraper: { details: BANNER_VARIANTS.skyscraper, fileDetails: [] },
        leaderboard: { details: BANNER_VARIANTS.leaderboard, fileDetails: [] },
        billboard: { details: BANNER_VARIANTS.billboard, fileDetails: [] },
        halfPage: { details: BANNER_VARIANTS.halfPage, fileDetails: [] },
        mobileBanner: { details: BANNER_VARIANTS.mobileBanner, fileDetails: [] },
        mobileLeaderboard: { details: BANNER_VARIANTS.mobileLeaderboard, fileDetails: [] },
        others: { fileDetails: [] }
      }

      if (files.length === 0) {
        updateBanners(bannersDefaultValue)
        return
      }

      const variantKeys = Object.keys(BANNER_VARIANTS)

      files &&
        files.forEach((file: FileWithPath) => {
          const reader = new FileReader()
          let matchedVariant: BannerVariant | null = null
          reader.onload = (e: any) => {
            const img = new Image()
            img.src = e.target.result

            img.onload = () => {
              const width = img.width
              const height = img.height

              for (let i = 0; i < variantKeys.length; i += 1) {
                const variant = BANNER_VARIANTS[variantKeys[i]]
                matchedVariant = variant
                if (variant.bannerSizes === `${width}x${height}`) {
                  matchedVariant.checked = true
                  bannersDefaultValue[matchedVariant!.label]!.fileDetails.push(file)
                  break
                }
              }
              if (!matchedVariant?.checked) bannersDefaultValue.others.fileDetails.push(file)

              updateBanners(bannersDefaultValue)
            }
          }
          reader.readAsDataURL(file)
        })
    },
    [updateBanners]
  )

  useEffect(() => {
    getBanners(uploadedFiles || [])
  }, [uploadedFiles, getBanners])

  return {
    onDrop,
    updateUploadedFiles,
    uploadedFiles
  }
}

export default useDropzone
