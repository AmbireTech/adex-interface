import { Navbar, ScrollArea, Box } from '@mantine/core'
import NavLink from './NavLink'

function SideNav() {
  return (
    <Navbar width={{ base: 210 }} height="100%" p="xs">
      <Navbar.Section mt="xs">AdEx logo here</Navbar.Section>
      <Navbar.Section mt="xs" grow component={ScrollArea} mx="-xs" px="xs">
        <Box py="md">
          <NavLink label="Dashboard" />
          <NavLink label="Deposit" />
          <NavLink label="Billing" />
          <NavLink label="Help Center" />
        </Box>
      </Navbar.Section>
    </Navbar>
  )
}

export default SideNav
