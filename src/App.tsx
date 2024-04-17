import { Global, MantineProvider, Progress } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { AccountProvider } from 'contexts/AccountContext'
import { CampaignsDataProvider, CampaignsAnalyticsProvider } from 'contexts/CampaignsContext'
import { RouterProvider } from 'react-router-dom'
import { router } from 'Router'
import { lightTheme } from 'themes'
import { Notifications } from '@mantine/notifications'

const ENV = process.env.REACT_APP_ENV

function GlobalStyles() {
  return (
    <Global
      styles={(theme) => ({
        [theme.other.media.print]: {
          body: {
            visibility: 'hidden'
          },
          'body #printable': {
            visibility: 'visible'
          }
        }
      })}
    />
  )
}

const EnvBanner = () => (
  <Progress
    radius="xs"
    size={18}
    animate
    style={{ zIndex: 42069, opacity: 0.5, position: 'fixed', top: 0, left: 0, right: 0 }}
    sections={[{ value: 100, color: 'grape', label: ENV }]}
  />
)

function App() {
  return (
    <AccountProvider>
      <CampaignsDataProvider>
        <CampaignsAnalyticsProvider>
          <MantineProvider withGlobalStyles withNormalizeCSS theme={lightTheme}>
            <ModalsProvider>
              <GlobalStyles />
              <Notifications />
              {ENV && <EnvBanner />}
              <RouterProvider router={router} />
            </ModalsProvider>
          </MantineProvider>
        </CampaignsAnalyticsProvider>
      </CampaignsDataProvider>
    </AccountProvider>
  )
}

export default App
