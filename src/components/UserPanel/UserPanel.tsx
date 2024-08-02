import { AppShell, Burger, Flex } from '@mantine/core'
import SideNav from 'components/SideNav'
import TopBar from 'components/TopBar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SIDE_BAR_WIDTH } from 'themes/base'

function UserPanel() {
  const [opened, setOpened] = useState(false)

  // husky test

  return (
    <AppShell
      padding="md"
      layout="alt"
      bg="lightBackground"
      header={{ height: 90 }}
      navbar={{ width: SIDE_BAR_WIDTH, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
      <AppShell.Header h={90} pr="xl" pl="xl">
        <Flex direction="row" wrap="nowrap" w="100%" align="center" h="100%">
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="md"
            color="grey"
            mr="xl"
            hiddenFrom="sm"
          />

          <TopBar />
        </Flex>
      </AppShell.Header>

      <AppShell.Navbar p="xs">
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          size="md"
          color="grey"
          mr="xl"
          hiddenFrom="sm"
        />
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default UserPanel
