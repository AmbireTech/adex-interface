import { RampInstantSDK } from '@ramp-network/ramp-instant-sdk'
import { popupCenter } from 'lib/popupHelper'
import { fetchService } from 'services'
import url from 'url'

// import { RAMP_HOST_API_KEY, PAYTRIE_PARTNER_URL, TRANSAK_API_KEY, TRANSAK_ENV } from 'config'

type AssetsList = {
  [key: string]: string
}
const RAMP_HOST_API_KEY = process.env.REACT_APP_RAMP_HOST_API_KEY
const DAPP_ICON_PATH = process.env.REACT_APP_DAPP_ICON_PATH
const PAYTRIE_PARTNER_URL = process.env.REACT_APP_PAYTRIE_PARTNER_URL

// const useProviders = ({ walletAddress, selectedNetwork, relayerURL, portfolio }) => {

const useProviders = () => {
  //   const [isLoading, setLoading] = useState([])

  // TODO: remove walletAddress
  const walletAddress = '0xBed0dCC1503bF94B7E3F577a7945ecA229247e64'.toLowerCase()

  const openRampNetwork = () => {
    const assetsList: AssetsList = {
      ethereum: 'ERC20_*,ETH_*',
      polygon: 'MATIC_ERC20_*,MATIC_*',
      avalanche: 'AVAX_*',
      'binance-smart-chain': 'BSC_*,BSC_ERC20_*',
      gnosis: 'XDAI_*'
    }

    const widget = new RampInstantSDK({
      hostAppName: 'Ambire',
      hostLogoUrl: DAPP_ICON_PATH as string,
      variant: 'auto',
      swapAsset: assetsList.polygon,
      userAddress: walletAddress,
      hostApiKey: RAMP_HOST_API_KEY
    })
    widget.show()
  }

  const openPayTrie = async () => {
    // setLoading((prevState) => ['PayTrie', ...prevState])
    const rightSideLabels: AssetsList = {
      ethereum: 'USDC',
      polygon: 'USDC-P',
      'binance-smart-chain': 'USDT-B'
    }

    const URL = url.parse(PAYTRIE_PARTNER_URL as string, true)
    URL.search = null
    URL.query = {
      ...URL.query,
      addr: walletAddress,
      rightSideLabel: rightSideLabels.polygon
    }

    popupCenter({
      url: url.format(URL),
      title: 'Paytrie Deposit',
      w: 450,
      h: 400
    })
    //   setLoading((prevState) => prevState.filter((n) => n !== 'PayTrie'))
  }

  const relayerURL = 'https://relayer.ambire.com'
  const processResponse = (res: any) => {
    if (res.status >= 200 && res.status < 400) {
      return res.json()
    }
    // TODO: fix that
    return res.text().then((text: any) => {
      if (res.status === 401 || res.status === 403) {
        throw new Error('something went wrong', text)
      }
    })
  }

  const openMoonpay = async () => {
    const mode = 'buy'
    const selectedAsset = 'ETH'
    // setLoading((prevState) => ['MoonPay', ...prevState])
    const moonpayResponse = await fetchService({
      url: `${relayerURL}/moonpay/${walletAddress}/${mode}/${selectedAsset}`
    }).then(processResponse)

    if (moonpayResponse.success && moonpayResponse.data && moonpayResponse.data.url)
      popupCenter({
        url: url.format(moonpayResponse.data.url),
        title: 'MoonPay Deposit',
        w: 515,
        h: 600
      })
    else console.error(`Error: ${moonpayResponse.data ? moonpayResponse.data : 'unexpected error'}`)
    //   addToast(`Error: ${moonpayResponse.data ? moonpayResponse.data : 'unexpected error'}`, {
    //     error: true
    //   })
    //   setLoading((prevState) => prevState.filter((n) => n !== 'MoonPay'))
  }

  return {
    openRampNetwork,
    openPayTrie,
    // openGuardarian,
    openMoonpay
    // isLoading
  }
}

export default useProviders
