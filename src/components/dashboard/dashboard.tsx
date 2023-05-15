// import { useState } from 'react'
import { AppShell } from '@mantine/core'
import SideNav from 'components/SideNav'
import TopBar from 'components/TopBar'
import { Outlet } from 'react-router-dom'

function Dashboard() {
  // const [opened, setOpened] = useState(false)

  // husky test

  return (
    <AppShell
      padding="md"
      layout="alt"
      navbar={<SideNav />}
      header={<TopBar />}
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

export default Dashboard
