import { Navbar, ScrollArea, Box } from '@mantine/core'
import useAccount from 'hooks/useAccount'
import { useNavigate } from 'react-router-dom'
import DashboardIcon from 'resources/icons/Dashboard'
import DepositIcon from 'resources/icons/Deposit'
import BillingIcon from 'resources/icons/Billing'
import HelpIcon from 'resources/icons/Help'
import NavLink from './NavLink'

function SideNav() {
  const { connectWallet, disconnectWallet, adexAccount } = useAccount()
  const navigate = useNavigate()
  return (
    <Navbar width={{ base: 210 }} height="100%" p="xs">
      <Navbar.Section mt="xs">AdEx logo here</Navbar.Section>
      <Navbar.Section mt="xs" grow component={ScrollArea} mx="-xs" px="xs">
        <Box py="md">
          <NavLink
            icon={<DashboardIcon />}
            label="Dashboard"
            action={() => navigate('/dashboard')}
          />
          <NavLink icon={<DepositIcon />} label="Deposit" />
          <NavLink icon={<BillingIcon />} label="Billing" action={() => navigate('billing')} />
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
