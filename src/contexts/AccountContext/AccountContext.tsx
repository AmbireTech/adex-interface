import { createContext, FC, PropsWithChildren, useMemo, useCallback, useEffect } from 'react'
import { IAdExAccount } from 'types'
import { useLocalStorage } from '@mantine/hooks'
import { getMessageToSign } from 'lib/backend'

import { AmbireLoginSDK } from '@ambire/login-sdk-core'

const ambireLoginSDK = new AmbireLoginSDK({
  dappName: 'AdEx Platform',
  dappIconPath:
    'https://raw.githubusercontent.com/AmbireTech/ambire-brand/main/adex-logos/Ambire_AdEx_Symbol_color.svg'
})

// const testAccount: IAdExAccount = {
//   email: 'gosho@myyanko.com',
//   address: '0x70fC54B13FA83571006c289B9A6bbAE69dfD4e46'
// }

interface IAccountContext {
  adexAccount: IAdExAccount | null
  authenticated: boolean
  ambireSDK: AmbireLoginSDK
  connectWallet: () => void
  disconnectWallet: () => void
}

const AccountContext = createContext<IAccountContext | null>(null)

// TODO: persist data
const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const ambireSDK = useMemo(() => ambireLoginSDK, [])

  const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
    key: 'adexAccount',
    defaultValue: {
      address: '0xkuramiqnko',
      chainId: 1
    }
  })
  // const authenticated = !!adexAccount
  // console.log('adexAccount', adexAccount)
  useEffect(() => {
    ambireSDK.onLoginSuccess(async (data: any) => {
      console.log({ data })
      console.log('onLoginSuccess')
      setAdexAccount({ address: data.address, chainId: data.chainId })
      const messageToSign = await (
        await getMessageToSign({ address: data.address, chainId: data.chainId })
      ).data.authMsg

      ambireSDK.openSignMessage('eth_signTypedData', JSON.stringify(messageToSign))
    })

    ambireSDK.onLogoutSuccess((data: any) => {
      console.log({ data })
      console.log('onLogoutSuccess')
      setAdexAccount(null)
    })

    ambireSDK.onMsgSigned((data: any) => {
      console.log('onMsgSigned', data)
    })
    ambireSDK.onMsgRejected((data: any) => {
      console.log('onMsgRejected', data)
    })
  }, [ambireSDK, setAdexAccount])

  const connectWallet = useCallback(async () => {
    console.log('connectwallet', ambireSDK)
    ambireLoginSDK.openLogin()
  }, [ambireSDK])

  const disconnectWallet = useCallback(async () => {
    console.log('disconnectWallet', ambireSDK)
    ambireLoginSDK.openLogout()
  }, [ambireSDK])

  const signMessage = useCallback(
    async (type: string, message: string) => {
      console.log('openSignMessage')
      ambireSDK.openSignMessage(type, message)
    },
    [ambireSDK]
  )

  const authenticated = useMemo(() => !!adexAccount, [adexAccount])

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK
    }),
    [adexAccount, ambireSDK, authenticated, connectWallet, disconnectWallet, signMessage]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
