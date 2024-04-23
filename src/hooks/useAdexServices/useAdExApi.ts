import useAccount from 'hooks/useAccount'

export const useAdExApi = () => {
  const { adexServicesRequest } = useAccount()
  return {
    adexServicesRequest
  }
}
