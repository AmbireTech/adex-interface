import { useAdExApi } from 'hooks/useAdexServices'
import { useCallback } from 'react'

type MediaUploadRes = {
  ipfsUrl: string
  webUrl: string
  isPinned: boolean
}

type ZipUploadRes = {
  root: MediaUploadRes
  ipfsUrls: MediaUploadRes[]
}

const useMediaUpload = () => {
  const { adexServicesRequest } = useAdExApi()

  const uploadMedia = useCallback(
    async (media: Blob, mediaName: string, shouldPin: boolean = false): Promise<MediaUploadRes> => {
      const formData = new FormData()
      formData.append('media', media, mediaName)
      formData.append('shouldPin', shouldPin.toString())

      return adexServicesRequest<MediaUploadRes>('backend', {
        route: '/dsp/ipfs/upload',
        method: 'POST',
        body: formData
      })
    },
    [adexServicesRequest]
  )

  const uploadZipMedia = useCallback(
    async (media: Blob, mediaName: string, shouldPin: boolean = false): Promise<ZipUploadRes> => {
      const formData = new FormData()
      formData.append('zip', media, mediaName)
      formData.append('shouldPin', shouldPin.toString())

      return adexServicesRequest<ZipUploadRes>('backend', {
        route: '/dsp/ipfs/upload-zip',
        method: 'POST',
        body: formData
      })
    },
    [adexServicesRequest]
  )

  return { uploadMedia, uploadZipMedia }
}

export default useMediaUpload
