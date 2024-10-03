import useAccount from 'hooks/useAccount'

import { FundsActivity } from 'components/AdminPanel/AccountDetailsElements'

const AccountActivity = () => {
  const { adexAccount } = useAccount()

  return <FundsActivity accountData={adexAccount} />
}

export default AccountActivity
