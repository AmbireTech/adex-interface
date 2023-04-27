// import { useState } from 'react'
import { AppShell, Header } from '@mantine/core'
import SideNav from '../SideNav/SideNav'

function Dashboard() {
  // const [opened, setOpened] = useState(false)
  return (
    <AppShell
      padding="md"
      layout="alt"
      navbar={<SideNav />}
      header={
        <Header height={60} p="xs">
          Header here
        </Header>
      }
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
