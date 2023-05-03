// import { useState } from 'react'
import { AppShell } from '@mantine/core'
import SideNav from 'components/SideNav/SideNav'
import TopBar from 'components/TopBar/TopBar'

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
      {/* Your application here */}
    </AppShell>
  )
}

export default Dashboard
