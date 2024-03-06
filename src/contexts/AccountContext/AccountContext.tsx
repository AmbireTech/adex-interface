import {
  createContext,
  FC,
  PropsWithChildren,
  useMemo,
  useCallback,
  useEffect,
  useState
} from 'react'
import { IAdExAccount } from 'types'
import { useLocalStorage } from '@mantine/hooks'
import { getMessageToSign, verifyLogin } from 'lib/backend'

import { AmbireLoginSDK } from '@ambire/login-sdk-core'

const ambireLoginSDK = new AmbireLoginSDK({
  dappName: 'AdEx Platform',
  dappIconPath:
    'https://raw.githubusercontent.com/AmbireTech/ambire-brand/main/adex-logos/Ambire_AdEx_Symbol_color.svg'
})

interface IAccountContext {
  adexAccount: IAdExAccount | null
  authenticated: boolean
  ambireSDK: AmbireLoginSDK
  connectWallet: () => void
  disconnectWallet: () => void
  setAdexAccount: (
    val: IAdExAccount | ((prevState: IAdExAccount | null) => IAdExAccount | null) | null
  ) => void
  updateAuthMsgResp: (value: any) => void
}

const AccountContext = createContext<IAccountContext | null>(null)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
  const ambireSDK = useMemo(() => ambireLoginSDK, [])

  const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
    key: 'adexAccount',
    defaultValue: {
      address: '',
      chainId: 1,
      accessToken: '',
      refreshToken: '',
      authenticated: false
    }
  })

  const [authMsgResp, setAuthMsgResp] = useState<any>(null)
  const [messageToSign, setMessageToSign] = useState<string | null>(null)

  const updateAuthMsgResp = useCallback((value: any) => setAuthMsgResp(value), [setAuthMsgResp])

  useEffect(() => {
    const handleLoginSuccess = (data: any) => {
      if (!data) return
      const updatedAccount = { address: data.address, chainId: data.chainId }
      const { address, chainId } = data
      setAdexAccount((prevState) => ({ ...(prevState as IAdExAccount), address, chainId }))
      getMessageToSign(updatedAccount).then((getMessage) => {
        const messageToSignStringified = JSON.stringify(getMessage.authMsg)
        setMessageToSign(messageToSignStringified)
        updateAuthMsgResp(getMessage.authMsg)
      })
    }

    ambireSDK.onLoginSuccess(handleLoginSuccess)

    return () => {
      // ambireSDK.offLoginSuccess(handleLoginSuccess)
    }
  }, [ambireSDK, setAdexAccount, updateAuthMsgResp])

  useEffect(() => {
    const handleMsgSigned = ({ signature }: any) => {
      if (!authMsgResp) return
      const body = {
        authMsg: { ...authMsgResp },
        signature
      }

      verifyLogin(body)
        .then((authResp) => {
          if (!authResp) return
          setAdexAccount((prevState) => ({
            ...(prevState as IAdExAccount),
            accessToken: authResp.accessToken,
            refreshToken: authResp.refreshToken,
            authenticated: !!authResp.accessToken && !!authResp.refreshToken
          }))
        })
        .catch((e) => console.error('Error verifying login:', e))
    }

    ambireSDK.onMsgSigned(handleMsgSigned)

    return () => {
      // ambireSDK.offMsgSigned(handleMsgSigned)
    }
  }, [ambireSDK, authMsgResp, setAdexAccount])

  useEffect(() => {
    if (authMsgResp && messageToSign) {
      ambireSDK.openSignMessage('eth_signTypedData', messageToSign)
    }
  }, [ambireSDK, authMsgResp, messageToSign])

  useEffect(() => {
    const handleLogoutSuccess = () => {
      // if (adexAccount) {
      //   logout(adexAccount)
      //     .then((res) => {
      //       console.log('logoutRes', res)
      //       if (!res) return
      //       setAdexAccount(null)
      //       updateAuthMsgResp(null)
      //     })
      //     .catch((e) => console.log('Logout failed: ', e))
      // }
    }

    ambireSDK.onLogoutSuccess(handleLogoutSuccess)

    return () => {
      // ambireSDK.offLogoutSuccess(handleLogoutSuccess)
    }
  }, [ambireSDK, adexAccount, setAdexAccount, updateAuthMsgResp])

  const connectWallet = useCallback(async () => {
    ambireSDK.openLogin()
  }, [ambireSDK])

  const disconnectWallet = useCallback(async () => {
    ambireSDK.openLogout()
  }, [ambireSDK])

  const signMessage = useCallback(
    async (type: string, message: string) => {
      ambireSDK.openSignMessage(type, message)
    },
    [ambireSDK]
  )

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated: !adexAccount ? false : adexAccount.authenticated,
      // authenticated: true,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      setAdexAccount,
      updateAuthMsgResp
    }),
    [
      adexAccount,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      setAdexAccount,
      updateAuthMsgResp
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
