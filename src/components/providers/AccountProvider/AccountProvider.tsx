import { createContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from 'lib/safe-apps-react-sdk'

enum AccountType {
    UNSET,
    ADVERTISER,
    PUBLISHER
}

// TODO:
enum AdExRole {
    USER,
    ADMIN,
    OWNER
}

export interface IAdExAccount {
    name: string,
    users: Array<string>,
    adexIdentity: string,
}

const testAccount: IAdExAccount = {
    name: 'Gosho',
    users: ['0x123453'],
    adexIdentity: '0x70fC54B13FA83571006c289B9A6bbAE69dfD4e46'
}

interface IAccountContext {
    adexAccount: IAdExAccount | null,
    accountType: AccountType
    identity: string | null,
    provider: providers.Web3Provider | null,
    authenticated: boolean,
    availableAdexAccounts: Array<IAdExAccount>

}

const defaultContext = {
    adexAccount: null,
    accountType: AccountType.UNSET,
    identity: null,
    provider: null,
    authenticated: false,
    availableAdexAccounts: [testAccount]
}

const AccountContext = createContext<IAccountContext>(defaultContext)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
    const { sdk, safe } = useSafeAppsSDK()
    const [identity, setIdentity] = useState<IAccountContext['identity']>(defaultContext.identity)
    const [adexAccount] = useState<IAccountContext['adexAccount']>(defaultContext.adexAccount)
    const [accountType] = useState<IAccountContext['accountType']>(defaultContext.accountType)
    const [authenticated] = useState<IAccountContext['authenticated']>(defaultContext.authenticated)
    const [availableAdexAccounts] = useState<IAccountContext['availableAdexAccounts']>(defaultContext.availableAdexAccounts)

    const provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe])

    const contextValue = useMemo(() => ({
        identity,
        adexAccount,
        provider,
        accountType,
        authenticated,
        availableAdexAccounts
    }), [identity, adexAccount, provider, accountType, authenticated, availableAdexAccounts])

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

export { AccountType, AccountContext, AdExRole }
export default AccountProvider

