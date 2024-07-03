import { Tabs } from '@mantine/core'
import { AdminBadge } from 'components/common/AdminBadge'
import Dashboard from 'components/Dashboard'

const AdminPanel = () => {
  return (
    <>
      {/* //TODO: move to top bar */}
      <AdminBadge title="Admin Panel" />
      <Tabs defaultValue="campaigns">
        <Tabs.List>
          <Tabs.Tab value="campaigns">Campaigns</Tabs.Tab>
          <Tabs.Tab value="generalAnalytics">General Analytics</Tabs.Tab>
          <Tabs.Tab value="Deposits">Deposits</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="campaigns" pt="xs">
          <Dashboard isAdminPanel />
        </Tabs.Panel>

        <Tabs.Panel value="generalAnalytics" pt="xs">
          Analytics here
        </Tabs.Panel>

        <Tabs.Panel value="Deposits" pt="xs">
          Deposits here
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default AdminPanel
