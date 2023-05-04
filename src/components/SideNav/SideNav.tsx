import { Navbar, ScrollArea, Box } from '@mantine/core'
import useAccount from 'hooks/useAccount'
import NavLink from './NavLink'

function SideNav() {
  const { connectWallet, disconnectWallet, adexAccount } = useAccount()
  return (
    <Navbar width={{ base: 210 }} height="100%" p="xs">
      <Navbar.Section mt="xs">AdEx logo here</Navbar.Section>
      <Navbar.Section mt="xs" grow component={ScrollArea} mx="-xs" px="xs">
        <Box py="md">
          <NavLink label="Dashboard" />
          <NavLink label="Deposit" />
          <NavLink label="Billing" />
          <NavLink label="Help Center" />
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
