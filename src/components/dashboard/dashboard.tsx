import { AppShell, Navbar, Header } from '@mantine/core'

function Dashboard() {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 210 }} height="100%" p="xs">
          {/* Navbar content */}
        </Navbar>
      }
      header={
        <Header height={60} p="xs">
          {/* Header content */}
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
