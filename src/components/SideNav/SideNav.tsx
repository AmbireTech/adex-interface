import { Navbar, ScrollArea, Box, UnstyledButton, Text, Button } from '@mantine/core'
import useAccount from 'hooks/useAccount'
import { useMatch, useLocation, useResolvedPath, Link } from 'react-router-dom'
import DashboardIcon from 'resources/icons/Dashboard'
import DepositIcon from 'resources/icons/Deposit'
import BillingIcon from 'resources/icons/Billing'
import HelpIcon from 'resources/icons/Help'
import AdExLogo from 'resources/logos/AdExLogo'
import { useMemo } from 'react'
import NavLink from './NavLink'

function SideNav() {
  const { connectWallet, disconnectWallet, adexAccount } = useAccount()
  const location = useLocation()
  const match = useMatch(location.pathname)
  const year = useMemo(() => new Date().getFullYear(), [])
  return (
    <>
      <Navbar.Section mt="xs">
        <UnstyledButton style={{ display: 'block', height: 69 }} component={Link} to="" h={2}>
          <AdExLogo />
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section mt="xs" mx="-xs" grow component={ScrollArea}>
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
      <Navbar.Section mx="xs">
        <Button fullWidth variant="outline" size="md">
          See more
        </Button>
      </Navbar.Section>
      <Navbar.Section mx="xs">
        <Button fullWidth variant="filled" size="md">
          See more but filled
        </Button>
      </Navbar.Section>
      <Navbar.Section mx="xs" mt="xl">
        <Text size="sm">©{year} AdEx.</Text>
        <Text size="sm">All Rights Reserved.</Text>
        <Text size="sm">V.0.00.01</Text>
      </Navbar.Section>
    </>
  )
}

export default SideNav
