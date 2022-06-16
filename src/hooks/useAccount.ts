import { useContext } from 'react'
import { AccountContext } from 'components/AccountProvider/AccountProvider'

const useAccount = () => useContext(AccountContext)
export default useAccount