import { AppShell, Navbar, Header, MediaQuery, Burger, createStyles } from '@mantine/core'
import SideNav from 'components/SideNav'
import TopBar from 'components/TopBar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const useStyles = createStyles((theme) => ({
  main: {
    backgroundColor:
      theme.colorScheme === 'dark'
        ? theme.colors.darkBackground[theme.fn.primaryShade()]
        : theme.colors.lightBackground[theme.fn.primaryShade()]
  },
  header: {
    backgroundColor: 'inherit'
  }
}))

function UserPanel() {
  const { classes } = useStyles()
  const [opened, setOpened] = useState(false)

  // husky test

  return (
    <AppShell
      padding="md"
      layout="alt"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      fixed
      className={classes.main}
      navbar={
        <Navbar hiddenBreakpoint="sm" height="100%" p="xs" hidden={!opened}>
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
          pr="xl"
          pl="xl"
          className={classes.header}
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
    >
      <Outlet />
      {/* Your application here */}
    </AppShell>
  )
}

export default UserPanel
