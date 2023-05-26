import { Navbar, ScrollArea, Box } from '@mantine/core'
import useAccount from 'hooks/useAccount'
import { useMatch, useLocation, useResolvedPath } from 'react-router-dom'
import DashboardIcon from 'resources/icons/Dashboard'
import DepositIcon from 'resources/icons/Deposit'
import BillingIcon from 'resources/icons/Billing'
import HelpIcon from 'resources/icons/Help'
import AdExLogo from 'resources/logos/AdExLogo'
import NavLink from './NavLink'

function SideNav() {
  const { connectWallet, disconnectWallet, adexAccount } = useAccount()
  // const navigate = useNavigate()
  const location = useLocation()
  const match = useMatch(location.pathname)
  return (
    <Navbar width={{ base: 210 }} height="100%" p="xs">
      <Navbar.Section mt="xs">
        <AdExLogo />
      </Navbar.Section>
      <Navbar.Section mt="xs" grow component={ScrollArea} mx="-xs">
        <Box py="md">
          <NavLink
            to=""
            icon={<DashboardIcon />}
            label="Dashboard"
            active={useResolvedPath('').pathname === match?.pathname}
          />
          <NavLink
            to="deposit"
            icon={<DepositIcon />}
            label="Deposit"
            active={useResolvedPath('deposit').pathname === match?.pathname}
          />
          <NavLink
            to="billing"
            icon={<BillingIcon />}
            label="Billing"
            active={useResolvedPath('billing').pathname === match?.pathname}
          />
          <NavLink icon={<HelpIcon />} label="Help Center" />
          <NavLink label={`Test account login ${adexAccount?.address}`} action={connectWallet} />
          <NavLink
            label={`Test account disconnect ${adexAccount?.address}`}
            action={disconnectWallet}
          />
        </Box>
      </Navbar.Section>
    </Navbar>
  )
}

export default SideNav
