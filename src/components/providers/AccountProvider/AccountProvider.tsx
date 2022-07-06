import { createContext, useState, FC, PropsWithChildren, useMemo, useEffect, useCallback } from 'react'
import { ethers, providers } from 'ethers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from 'lib/safe-apps-react-sdk'
import { registerUser, getAdexAccountByIdentity } from 'lib/platform'
import { AccountType, AppError, IAdExAccount } from 'types'
import { useLocalStorage } from 'hooks'

// const testAccount: IAdExAccount = {
//     name: 'Gosho',
//     email: 'gosho@myyanko.com',
//     signers: [],
//     adexIdentity: '0x70fC54B13FA83571006c289B9A6bbAE69dfD4e46',
//     role: AccountType.UNSET
// }

interface IAccountContext {
    adexAccount: IAdExAccount | null,
    accountType: AccountType
    identity: string | null,
    provider: providers.Web3Provider | null,
    authenticated: boolean,
    registerAdexUser: (adexUser: IAdExAccount | null) => Promise<{ adexUser: IAdExAccount | null, error?: AppError }>
}

const defaultContext = {
    adexAccount: null,
    accountType: AccountType.UNSET,
    identity: null,
    provider: null,
    authenticated: false,
    availableAdexAccounts: [],
    registerAdexUser: registerUser
}

const AccountContext = createContext<IAccountContext>(defaultContext)

// TODO: persist data
const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
    const { sdk, safe } = useSafeAppsSDK()
    const [identity, setIdentity] = useState<IAccountContext['identity']>(defaultContext.identity)
    const [adexAccount, setAdexAccount] = useLocalStorage<IAccountContext['adexAccount']>({
        key: 'adexAccount',
        defaultValue: null,
    })
    const [accountType] = useState<IAccountContext['accountType']>(defaultContext.accountType)
    // const authenticated = !!adexAccount

    const registerAdexUser = useCallback(async (user: IAdExAccount | null) => {
        if (!identity) return { adexUser: null }

        const { adexUser, error } = await registerUser(user, identity)

        console.log({ adexUser })
        if (adexUser && identity && !error) {
            setAdexAccount(adexUser)
        }
        return { adexUser, error }
    }, [identity, setAdexAccount])

    useEffect(() => {
        if (!identity) {
            setAdexAccount(null)
            return
        }

        const getIdentity = async () => {
            const { identityAccount } = await getAdexAccountByIdentity(identity)
            setAdexAccount(identityAccount)
        }

        getIdentity()

    }, [identity, setAdexAccount])

    const authenticated = useMemo(() => !!adexAccount, [adexAccount])
    const provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe])

    const contextValue = useMemo(() => ({
        identity,
        adexAccount,
        provider,
        accountType,
        authenticated,
        registerAdexUser,
    }), [identity, adexAccount, provider, accountType, authenticated, registerAdexUser])

    useEffect(() => {
        setIdentity(safe?.safeAddress || null)
    }, [safe.safeAddress])

    return (<AccountContext.Provider
        value={contextValue}
    >
        {children}
    </AccountContext.Provider>
    )
}

export { AccountContext }
export default AccountProvider

