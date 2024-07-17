import { AppShell, Burger, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import SideNav from 'components/SideNav'
import TopBar from 'components/TopBar'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { SIDE_BAR_WIDTH } from 'themes/base'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)
  return {
    main: {
      backgroundColor: theme.colors.lightBackground[primaryShade]
      // colorScheme === 'dark'
      //   ? theme.colors.darkBackground[primaryShade]
      //   : theme.colors.lightBackground[primaryShade]
    },
    header: {
      backgroundColor: 'inherit'
    }
  }
})

function UserPanel() {
  const { classes } = useStyles()
  const [opened, setOpened] = useState(false)

  // husky test

  return (
    <AppShell
      padding="md"
      layout="alt"
      // navbarOffsetBreakpoint="sm"
      // asideOffsetBreakpoint="sm"
      // fixed
      className={classes.main}
      header={{ height: 90 }}
      navbar={{ width: SIDE_BAR_WIDTH, breakpoint: 'sm', collapsed: { mobile: true } }}
    >
      <AppShell.Header
        h={90}
        pr="xl"
        pl="xl"
        className={classes.header}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {/* <MediaQuery largerThan="sm" styles={{ display: 'none' }}> */}
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          size="md"
          color="grey"
          mr="xl"
          className="mantine-hidden-from-sm"
        />
        {/* </MediaQuery> */}
        <TopBar />
      </AppShell.Header>
      <AppShell.Navbar p="xs">
        {/* <MediaQuery largerThan="sm" styles={{ display: 'none' }}> */}
        <Burger
          opened={opened}
          onClick={() => setOpened((o) => !o)}
          size="md"
          color="grey"
          mr="xl"
          className="mantine-hidden-from-sm"
        />
        {/* </MediaQuery> */}
        <SideNav />
      </AppShell.Navbar>
      <AppShell.Main>
        <Outlet />
        {/* Your application here */}
      </AppShell.Main>
    </AppShell>
  )
}

export default UserPanel
