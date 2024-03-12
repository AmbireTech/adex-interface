import useAccount from 'hooks/useAccount'
import { useCallback } from 'react'
import { fetchService } from 'services'
// TODO: move it to helper
const processResponse = (res: any) => {
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error('something went wrong', text)
    }
  })
}

const useFetch = () => {
  const { updateAccessToken } = useAccount()

  const fetchAuthRequest = useCallback(
    async (req: any) => {
      const response = await updateAccessToken()

      if (response) {
        const updatedAccessToken = response.accessToken
        const updatedReq = { ...req, 'X-DSP-AUTH': `Bearer ${updatedAccessToken}` }

        return fetchService(updatedReq).then(processResponse)
      }

      return fetchService(req).then(processResponse)
    },
    [updateAccessToken]
  )

  return {
    fetchAuthRequest
  }
}

export default useFetch
