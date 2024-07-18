import { Tabs } from '@mantine/core'
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { AdminBadge } from 'components/common/AdminBadge'
import Dashboard from 'components/Dashboard'
import AdminAnalytics from './AdminAnalytics'
import Accounts from './Accounts'
import { SspStats } from './SspStats'
// import { AccountDetails } from './AccountDetails'

const AdminPanel = () => {
  const navigate = useNavigate()
  const { tabValue = 'campaigns' } = useParams()

  console.log({ tabValue })

  return (
    <>
      {/* //TODO: move to top bar */}
      <AdminBadge title="Admin Panel" />
      <Tabs
        value={tabValue}
        onTabChange={(value) => navigate(`/dashboard/admin/${value}`)}
        keepMounted={false}
      >
        <Tabs.List>
          <Tabs.Tab value="campaigns">Campaigns</Tabs.Tab>
          <Tabs.Tab value="validatorAnalytics">Validator Analytics</Tabs.Tab>
          <Tabs.Tab value="sspStats">SSP stats</Tabs.Tab>
          <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
          <Tabs.Tab value="user-account" hidden>
            Account details
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="campaigns" pt="xs">
          <Dashboard isAdminPanel />
        </Tabs.Panel>

        <Tabs.Panel value="validatorAnalytics" pt="xs">
          <AdminAnalytics />
        </Tabs.Panel>

        <Tabs.Panel value="sspStats" pt="xs">
          <SspStats />
        </Tabs.Panel>

        <Tabs.Panel value="accounts" pt="xs">
          <Accounts />
        </Tabs.Panel>

        <Tabs.Panel value="user-account" pt="xs">
          {/* <AccountDetails /> */}
          <Outlet />
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default AdminPanel
