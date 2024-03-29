import { useAdExApi } from 'hooks/useAdexServices'
import { useCallback } from 'react'

const useMediaUpload = () => {
  const { adexServicesRequest } = useAdExApi()

  const uploadMedia = useCallback(
    async (media: Blob, mediaName: string, shouldPin: boolean = false) => {
      const formData = new FormData()
      formData.append('media', media, mediaName)
      formData.append('shouldPin', shouldPin.toString())

      return adexServicesRequest('backend', {
        route: '/dsp/ipfs/upload',
        method: 'POST',
        body: formData
      })
    },
    [adexServicesRequest]
  )

  const uploadZipMedia = useCallback(
    async (media: Blob, mediaName: string, shouldPin: boolean = false) => {
      const formData = new FormData()
      formData.append('zip', media, mediaName)
      formData.append('shouldPin', shouldPin.toString())

      return adexServicesRequest('backend', {
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
