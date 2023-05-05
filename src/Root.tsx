import Dashboard from 'components/Dashboard'
import LogIn from 'components/LogIn'

import useAccount from 'hooks/useAccount'

// TODO: router or not

function Root() {
  const { authenticated } = useAccount()

  return authenticated ? <Dashboard /> : <LogIn />
}

export default Root
