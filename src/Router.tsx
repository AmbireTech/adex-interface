import UserPanel from 'components/UserPanel'
import LogIn from 'components/LogIn'
import Dashboard from 'components/Dashboard'
import AdminPanel from 'components/AdminPanel'
import Billing from 'components/Billing'
import GetStarted from 'components/GetStarted'
import CampaignAnalytics from 'components/CampaignAnalytics'
import { createBrowserRouter, Navigate, useLocation, useRouteError, Link } from 'react-router-dom'
import { Button } from '@mantine/core'

import useAccount from 'hooks/useAccount'
import Deposit from 'components/Deposit'
import CreateCampaign from 'components/CreateCampaign'
import { CreateCampaignContextProvider } from 'contexts/CreateCampaignContext/CreateCampaignContext'
import { CampaignsDataProvider, CampaignsAnalyticsProvider } from 'contexts/CampaignsContext'
import NotFound404 from 'components/404/404'
// import AdminPanel from './admin/Admin'
import { AccountDetails } from 'components/AdminPanel/AccountDetails'
import CampaignDetails from './components/CampaignDetails'

function ErrorBoundary() {
  const error = useRouteError()
  console.error(error)
  return (
    <div>
      <div>Unexpected error occurred</div>
      <br />
      <Button variant="filled" color="secondaryAccent" size="md" component={Link} to="/dashboard">
        Go to dashboard
      </Button>
    </div>
  )
}

function RequireAuth({ children, admin }: { children: JSX.Element; admin?: boolean }) {
  const { authenticated, isAdmin } = useAccount()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (admin && isAdmin) {
    return <Navigate to="/404" state={{ from: location }} replace />
  }

  return children
}

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Navigate to="/dashboard" />,
      errorElement: <ErrorBoundary />
    },
    {
      path: '/login',
      element: <LogIn />
    },
    {
      // TODO: rename the path
      path: '/dashboard',
      element: (
        <RequireAuth>
          <CampaignsDataProvider type="user">
            <CampaignsAnalyticsProvider>
              <CreateCampaignContextProvider>
                <UserPanel />
              </CreateCampaignContextProvider>
            </CampaignsAnalyticsProvider>
          </CampaignsDataProvider>
        </RequireAuth>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: '',
          element: <Dashboard />
        },
        { path: 'campaign-analytics/:id/:activeTab?', element: <CampaignAnalytics /> },
        {
          path: 'campaign-analytics/admin/:id/:activeTab?',
          element: <CampaignAnalytics isAdminPanel />
        },
        { path: 'campaign-details/:id/:tabValue?', element: <CampaignDetails /> },
        {
          path: 'campaign-details/admin/:id/:tabValue?',
          element: <CampaignDetails isAdminPanel />
        },
        {
          path: 'billing',
          element: <Billing />
        },
        {
          path: 'get-started',
          element: <GetStarted />
        },
        {
          path: 'deposit',
          element: <Deposit />
        },
        {
          path: 'create-campaign',
          element: <CreateCampaign />
        },
        {
          path: 'admin/:tabValue',
          element: (
            <RequireAuth>
              <CampaignsDataProvider type="admin">
                <AdminPanel />
              </CampaignsDataProvider>
            </RequireAuth>
          ),
          children: [
            {
              path: ':accountId',
              element: <AccountDetails />
            }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <NotFound404 />
    }
  ],
  {
    basename: `/${process.env.REACT_APP_BASE_NAME || ''}`
  }
)
