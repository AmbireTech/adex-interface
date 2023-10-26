import { useContext } from 'react'
import { AccountContext } from 'contexts/AccountContext/AccountContext'

function useAccount() {
  const context = useContext(AccountContext)
  // NOTE: as there is no way to detect if the context is used with provider
  // and with ts forcing default values for createCOntext there is always context
  // we can declare contexts as follows:
  // `const AccountContext = createContext<IAccountContext | null>(null)`
  // this way we can use the context as hook and be sure there is provider for it
  // with the next check we guarantee the type of the context (IAccountContext)
  if (!context) throw new Error('useAccount should be used with AccountProvider')
  return context
}
export default useAccount
