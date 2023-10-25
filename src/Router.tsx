import UserPanel from 'components/UserPanel'
import LogIn from 'components/LogIn'
import Dashboard from 'components/Dashboard'
import Billing from 'components/Billing'
import GetStarted from 'components/GetStarted'
import CampaignAnalytics from 'components/CampaignAnalytics'
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom'

import useAccount from 'hooks/useAccount'
import Deposit from 'components/Deposit'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authenticated } = useAccount()
  const location = useLocation()

  console.log('basename - ', process.env.BASE_NAME)

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

console.log('basename 1 - ', process.env.BASE_NAME)

export const router = createBrowserRouter(
  [
    {
      // TODO: rename the path
      path: '/',
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
        }
      ]
    },
    {
      path: '/login',
      element: <LogIn />
    }
  ],
  {
    basename: '/staging'
  }
)
