import { createContext, useState, useEffect, useContext, useMemo, ReactElement, PropsWithChildren } from 'react';
import SafeAppsSDK, { Opts as SDKOpts, SafeInfo } from '@gnosis.pm/safe-apps-sdk';


// Note: copy/paste from https://github.com/safe-global/safe-apps-sdk/tree/master/packages/safe-apps-react-sdk
// Because of react 16/17 deps
// Fixed some warnings
type SafeReactSDKContext = {
    sdk: SafeAppsSDK;
    connected: boolean;
    safe: SafeInfo;
};

const SafeContext = createContext<SafeReactSDKContext | undefined>(undefined);

interface Props extends PropsWithChildren {
    loader?: ReactElement;
    opts?: SDKOpts;
}

export const SafeProvider: React.FC<Props> = ({ loader = null, opts, children }) => {
    const [sdk] = useState(() => new SafeAppsSDK(opts));
    const [connected, setConnected] = useState(false);
    const [safe, setSafe] = useState<SafeInfo>({ safeAddress: '', chainId: 1, threshold: 1, owners: [], isReadOnly: false });
    const contextValue = useMemo(() => ({ sdk, connected, safe }), [sdk, connected, safe]);

    useEffect(() => {
        let active = true;
        const fetchSafeInfo = async () => {
            try {
                const safeInfo = await sdk.safe.getInfo();

                if (!active) {
                    return;
                }
                setSafe(safeInfo);
                setConnected(true);
            } catch (err) {
                if (!active) {
                    return;
                }
                setConnected(false);
            }
        };

        fetchSafeInfo();

        return () => {
            active = false;
        };
    }, [sdk]);

    if (!connected && loader) {
        return loader;
    }

    return <SafeContext.Provider value={contextValue}>{children}</SafeContext.Provider>;
};

export const useSafeAppsSDK = (): SafeReactSDKContext => {
    const value = useContext(SafeContext);

    if (value === undefined) {
        throw new Error('You probably forgot to put <SafeProvider>.');
    }

    return value;
};

export default SafeProvider;