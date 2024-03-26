import useAccount from 'hooks/useAccount'
import useFetch from 'hooks/useFetchRequest'
import { BASE_URL } from 'constants/login'
import { useCallback } from 'react'

const useCampaignsData = () => {
  const { adexAccount } = useAccount()
  const { fetchAuthRequest } = useFetch()

  const getCampaignById = useCallback(
    async (id: string) => {
      return fetchAuthRequest({
        url: `${BASE_URL}/dsp/campaigns/by-id/${id}`,
        method: 'GET',
        headers: {
          'X-DSP-AUTH': `Bearer ${adexAccount?.accessToken}`
        }
      })
    },
    [adexAccount?.accessToken, fetchAuthRequest]
  )

  const getAllCampaigns = useCallback(
    () =>
      fetchAuthRequest({
        url: `${BASE_URL}/dsp/campaigns/by-owner`,
        method: 'GET',
        headers: {
          'X-DSP-AUTH': `Bearer ${adexAccount?.accessToken}`
        }
      }),
    [adexAccount?.accessToken, fetchAuthRequest]
  )
  return { getCampaignById, getAllCampaigns }
}

export default useCampaignsData
