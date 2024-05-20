import UserPanel from 'components/UserPanel'
import LogIn from 'components/LogIn'
import Dashboard from 'components/Dashboard'
import Billing from 'components/Billing'
import GetStarted from 'components/GetStarted'
import CampaignAnalytics from 'components/CampaignAnalytics'
import { createBrowserRouter, Navigate, useLocation, useRouteError, Link } from 'react-router-dom'
import { Button } from '@mantine/core'

import useAccount from 'hooks/useAccount'
import Deposit from 'components/Deposit'
import CreateCampaign from 'components/CreateCampaign'
import { CreateCampaignContextProvider } from 'contexts/CreateCampaignContext/CreateCampaignContext'
import NotFound404 from 'components/404/404'
import AdminPanel from './admin/Admin'
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
  const {
    authenticated,
    isAdmin,
    adexAccount: { loaded, initialLoad }
  } = useAccount()
  const location = useLocation()

  if (!loaded && !initialLoad) {
    return null // Or a loading spinner
  }

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
          <CreateCampaignContextProvider>
            <UserPanel />
          </CreateCampaignContextProvider>
        </RequireAuth>
      ),
      errorElement: <ErrorBoundary />,
      children: [
        {
          path: '',
          element: <Dashboard />
        },
        { path: 'campaign-analytics/:id', element: <CampaignAnalytics /> },
        { path: 'campaign-details/:id', element: <CampaignDetails /> },
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
          path: 'admin',
          element: (
            <RequireAuth>
              <AdminPanel />
            </RequireAuth>
          )
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
