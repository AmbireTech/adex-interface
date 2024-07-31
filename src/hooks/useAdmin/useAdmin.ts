import { useContext } from 'react'
import { AdminContext } from 'contexts/AdminContext'

function useAdmin() {
  const context = useContext(AdminContext)
  // NOTE: as there is no way to detect if the context is used with provider
  // and with ts forcing default values for createContext there is always context
  // we can declare contexts as follows:
  // `const AdminContext = createContext<IAdminContext | null>(null)`
  // this way we can use the context as hook and be sure there is provider for it
  // with the next check we guarantee the type of the context (IAdminContext)
  if (!context) throw new Error('useAdmin should be used with AdminProvider')
  return context
}
export default useAdmin
