// import { useState } from 'react'
import { AppShell, Navbar, Header, MediaQuery, Burger } from '@mantine/core'
import SideNav from 'components/SideNav'
import TopBar from 'components/TopBar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

function UserPanel() {
  const [opened, setOpened] = useState(false)

  // husky test

  return (
    <AppShell
      padding="md"
      layout="alt"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar hiddenBreakpoint="sm" width={{ sm: 210 }} height="100%" p="xs" hidden={!opened}>
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="md"
              color="grey"
              mr="xl"
            />
          </MediaQuery>
          <SideNav />
        </Navbar>
      }
      header={
        <Header
          height={90}
          p="sm"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
            <Burger
              opened={opened}
              onClick={() => setOpened((o) => !o)}
              size="md"
              color="grey"
              mr="xl"
            />
          </MediaQuery>
          <TopBar />
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]
        }
      })}
    >
      <Outlet />
      {/* Your application here */}
    </AppShell>
  )
}

export default UserPanel
