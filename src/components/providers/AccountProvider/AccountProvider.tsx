import { createContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react'
import { ethers, providers } from 'ethers'
import { SafeAppProvider } from '@gnosis.pm/safe-apps-provider'
import { useSafeAppsSDK } from 'lib/safe-apps-react-sdk'

enum AccountType {
    UNSET,
    ADVERTISER,
    PUBLISHER
}

interface IAccountContext {
    accountType: AccountType
    identity: string | null,
    name: string | null,
    provider: providers.Web3Provider | null,
    authenticated: boolean,
}

const defaultContext = {
    accountType: AccountType.UNSET,
    identity: null,
    name: null,
    provider: null,
    authenticated: false
}

const AccountContext = createContext<IAccountContext>(defaultContext)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
    const { sdk, safe } = useSafeAppsSDK()
    const [identity, setIdentity] = useState<IAccountContext['identity']>(defaultContext.identity)
    const [name] = useState<IAccountContext['name']>(defaultContext.name)
    const [accountType] = useState<IAccountContext['accountType']>(defaultContext.accountType)
    const [authenticated] = useState<IAccountContext['authenticated']>(defaultContext.authenticated)

    const provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe])

    const contextValue = useMemo(() => ({
        identity,
        name,
        provider,
        accountType,
        authenticated
    }), [identity, name, provider, accountType, authenticated])
    
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

export { AccountType, AccountContext }
export default AccountProvider

