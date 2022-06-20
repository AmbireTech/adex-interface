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
    provider: providers.Web3Provider | null
}

const defaultContext = {
    accountType: AccountType.UNSET,
    identity: null,
    name: null,
    provider: null
}

const AccountContext = createContext<IAccountContext>(defaultContext)

const AccountProvider: FC<PropsWithChildren> = ({ children }) => {
    const { sdk, safe } = useSafeAppsSDK()
    const [identity, setIdentity] = useState<IAccountContext['identity']>(defaultContext.identity)
    const [name] = useState<IAccountContext['name']>(defaultContext.name)
    const [accountType] = useState<IAccountContext['accountType']>(defaultContext.accountType)

    const provider = useMemo(() => new ethers.providers.Web3Provider(new SafeAppProvider(safe, sdk)), [sdk, safe])

    useEffect(() => {
        setIdentity(safe?.safeAddress || null)
    }, [safe.safeAddress])

    return (<AccountContext.Provider
        value={{
            identity,
            name,
            provider,
            accountType
        }}
    >
        {children}
    </AccountContext.Provider>
    )
}

export { AccountType, AccountContext }
export default AccountProvider

