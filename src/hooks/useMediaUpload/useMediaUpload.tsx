import useAccount from 'hooks/useAccount'
import useFetch from 'hooks/useFetchRequest'
import { BASE_URL } from 'constants/login'
import { useCallback } from 'react'

const useMediaUpload = () => {
  const { adexAccount } = useAccount()
  const { fetchAuthRequest } = useFetch()

  const uploadMedia = useCallback(
    async (media: Blob, mediaName: string, shouldPin: boolean = false) => {
      const formData = new FormData()
      formData.append('media', media, mediaName)
      formData.append('shouldPin', shouldPin.toString())

      const req = {
        url: `${BASE_URL}/dsp/ipfs/upload`,
        method: 'POST',
        headers: {
          'X-DSP-AUTH': `Bearer ${adexAccount?.accessToken}`
        },
        body: formData
      }
      return fetchAuthRequest(req)
    },
    [adexAccount?.accessToken, fetchAuthRequest]
  )

  return { uploadMedia }
}

export default useMediaUpload
