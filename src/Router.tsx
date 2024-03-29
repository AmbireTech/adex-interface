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
import { CreateCampaignContextProvider } from 'contexts/CreateCampaignContext/CreateCampaignContext'
import { CreateCampaignFormProvider } from 'contexts/CreateCampaignFormContext'
import NotFound404 from 'components/404/404'
import CampaignDetails from './components/CampaignDetails'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authenticated } = useAccount()
  const location = useLocation()

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export const router = createBrowserRouter(
  [
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
          element: (
            <CreateCampaignContextProvider>
              <CreateCampaignFormProvider>
                <CreateCampaign />
              </CreateCampaignFormProvider>
            </CreateCampaignContextProvider>
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
