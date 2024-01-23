import { useCallback, useEffect, useMemo, useState } from 'react'
import { FileWithPath } from 'types'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { AdUnitType } from 'adex-common/dist/types'

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
            const img = new Image()
            img.src = e.target.result
            const base64StringUS = e.target.result.replace('data:', '').replace(/^.+,/, '')

            img.onload = () => {
              const adUnit = {
                // TODO: Change the id because if drops more than one file it generate duplicate ids
                id: new Date().getTime().toString(),
                title: file.name,
                type: AdUnitType.Banner,
                banner: {
                  format: {
                    w: img.width,
                    h: img.height
                  },
                  mime: '',
                  mediaUrl: base64StringUS,
                  targetUrl: '',
                  created: BigInt(new Date().getTime())
                }
              }

              adUnitsCopy.push(adUnit)
              updateCampaign('adUnits', adUnitsCopy)
              updateUploadedFiles([])
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
