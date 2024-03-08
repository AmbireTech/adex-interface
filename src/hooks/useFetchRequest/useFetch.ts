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
      // logOut(skipRedirect)
    }
  })
}

const useFetch = () => {
  const { updateAccessToken } = useAccount()

  const fetchAuthRequest = useCallback(
    async (req: any) => {
      try {
        const response = await updateAccessToken()
        if (response) {
          const updatedReq = { ...req, 'X-DSP-AUTH': `Bearer ${response.accessToken}` }

          return await fetchService(updatedReq).then(processResponse)
        }
      } catch (error) {
        console.error('Error updating access token:', error)
        // Handle error gracefully
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
