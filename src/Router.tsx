import UserPanel from 'components/UserPanel'
import LogIn from 'components/LogIn'
import Dashboard from 'components/Dashboard'
import Billing from 'components/Billing'
import GetStarted from 'components/GetStarted'
import CampaignAnalytics from 'components/CampaignAnalytics'
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'

import useAccount from 'hooks/useAccount'
import Deposit from 'components/Deposit'
import CreateCampaign from 'components/CreateCampaign'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authenticated } = useAccount()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RequireAuth>
        <UserPanel />
      </RequireAuth>
    )
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
        <UserPanel />
      </RequireAuth>
    ),
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      { path: 'campaign-analytics/:id', element: <CampaignAnalytics /> },
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
      }
    ]
  }
])
