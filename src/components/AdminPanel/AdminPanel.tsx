import { Tabs } from '@mantine/core'
import { AdminBadge } from 'components/common/AdminBadge'
import Dashboard from 'components/Dashboard'
import AdminAnalytics from './AdminAnalytics'

const AdminPanel = () => {
  return (
    <>
      {/* //TODO: move to top bar */}
      <AdminBadge title="Admin Panel" />
      <Tabs defaultValue="campaigns" keepMounted={false}>
        <Tabs.List>
          <Tabs.Tab value="campaigns">Campaigns</Tabs.Tab>
          <Tabs.Tab value="generalAnalytics">Validator Analytics</Tabs.Tab>
          <Tabs.Tab value="Deposits">Deposits</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="campaigns" pt="xs">
          <Dashboard isAdminPanel />
        </Tabs.Panel>

        <Tabs.Panel value="generalAnalytics" pt="xs">
          <AdminAnalytics />
        </Tabs.Panel>

        <Tabs.Panel value="Deposits" pt="xs">
          TODO: Deposits here
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default AdminPanel
