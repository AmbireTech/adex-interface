import { Tabs, Paper, Container } from '@mantine/core'
import { useNavigate, useParams, Outlet } from 'react-router-dom'
import { AdminBadge } from 'components/common/AdminBadge'
import Dashboard from 'components/Dashboard'
import { StickyPanel } from 'components/TopBar/TopBarStickyPanel'
import AdminAnalytics from './AdminAnalytics'
import Accounts from './Accounts'
import { SspStats } from './SspStats'
// import { AccountDetails } from './AccountDetails'

const AdminPanel = () => {
  const navigate = useNavigate()
  const { tabValue = 'campaigns', accountId } = useParams()

  console.log({ tabValue })

  return (
    <Container fluid>
      <StickyPanel>
        <AdminBadge title="Admin Panel" />
      </StickyPanel>
      <Tabs
        value={tabValue}
        onChange={(value) => navigate(`/dashboard/admin/${value}`)}
        keepMounted={false}
      >
        <Tabs.List>
          <Tabs.Tab value="campaigns">All Campaigns</Tabs.Tab>
          <Tabs.Tab value="validatorAnalytics">Validator Analytics</Tabs.Tab>
          <Tabs.Tab value="sspStats">SSP stats</Tabs.Tab>
          <Tabs.Tab value="accounts">Accounts</Tabs.Tab>
          <Tabs.Tab value="user-account" disabled>
            Account details
          </Tabs.Tab>
        </Tabs.List>

        <Paper mt="md" p="sm" withBorder shadow="md">
          <Tabs.Panel value="campaigns" pt="xs">
            <Dashboard isAdminPanel accountId={accountId} />
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
        </Paper>
      </Tabs>
    </Container>
  )
}

export default AdminPanel
