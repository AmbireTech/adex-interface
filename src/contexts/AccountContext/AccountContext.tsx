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
import { getMessageToSign, isTokenExpired, refreshAccessToken, verifyLogin } from 'lib/backend'

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
  updateAdexAccount: (value: any) => void
  updateAuthMsgResp: (value: any) => void
  updateAccessToken: () => Promise<any>
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

  const updateAdexAccount = useCallback(
    (newValue: any | null) => {
      setAdexAccount((prevState) => (newValue === null ? newValue : { ...prevState, ...newValue }))
    },
    [setAdexAccount]
  )
  const updateMessageToSign = useCallback(
    (newValue: string) => setMessageToSign(newValue),
    [setMessageToSign]
  )

  const updateAuthMsgResp = useCallback((value: any) => setAuthMsgResp(value), [setAuthMsgResp])

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

  const updateAccessToken = useCallback(async () => {
    if (!adexAccount) return
    if (isTokenExpired(adexAccount)) {
      try {
        const response = await refreshAccessToken(adexAccount)
        if (response) {
          updateAdexAccount({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken
          })
          return response
        }
        return null
      } catch (error) {
        console.error('Error updating access token:', error)
        // Handle error gracefully, e.g., display an error message or retry later.
        throw error
      }
    }
  }, [adexAccount, updateAdexAccount])

  useEffect(() => {
    const handleLoginSuccess = async (data: any) => {
      if (!data) return
      const updatedAccount = { address: data.address, chainId: data.chainId }
      updateAdexAccount(updatedAccount)
      getMessageToSign(updatedAccount)
        .then((getMessage) => {
          const messageToSignStringified = JSON.stringify(getMessage.authMsg)
          updateMessageToSign(messageToSignStringified)
          updateAuthMsgResp(getMessage.authMsg)
        })
        .catch((e) => {
          debugger // eslint-disable-line no-debugger
          console.log('error', e)
        })
    }

    ambireSDK.onLoginSuccess(handleLoginSuccess)

    return () => {
      // ambireSDK.offLoginSuccess(handleLoginSuccess)
    }
  }, [ambireSDK, updateAdexAccount, updateAuthMsgResp, updateMessageToSign])

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
          updateAdexAccount({
            accessToken: authResp.accessToken,
            refreshToken: authResp.refreshToken,
            authenticated: !!authResp.accessToken && !!authResp.refreshToken
          })
        })
        .catch((e) => console.error('Error verifying login:', e))
    }
    ambireSDK.onMsgSigned(handleMsgSigned)

    return () => {
      // ambireSDK.offMsgSigned(handleMsgSigned)
    }
  }, [ambireSDK, authMsgResp, updateAdexAccount])

  useEffect(() => {
    const handleMsgRejected = () => {
      disconnectWallet()
    }

    ambireSDK.onMsgRejected(handleMsgRejected)

    return () => {
      // ambireSDK.offLogoutSuccess(handleLogoutSuccess)
    }
  }, [ambireSDK, disconnectWallet])

  useEffect(() => {
    if (authMsgResp && messageToSign) {
      ambireSDK.openSignMessage('eth_signTypedData', messageToSign)
    }
  }, [ambireSDK, authMsgResp, messageToSign])

  const authenticated = useMemo(
    () => (!adexAccount ? false : adexAccount.authenticated),
    [adexAccount]
  )

  const contextValue = useMemo(
    () => ({
      adexAccount,
      authenticated,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      updateAdexAccount,
      updateAuthMsgResp,
      updateAccessToken
    }),
    [
      adexAccount,
      authenticated,
      connectWallet,
      disconnectWallet,
      signMessage,
      ambireSDK,
      updateAdexAccount,
      updateAuthMsgResp,
      updateAccessToken
    ]
  )

  return <AccountContext.Provider value={contextValue}>{children}</AccountContext.Provider>
}

export { AccountContext, AccountProvider }
