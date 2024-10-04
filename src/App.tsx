import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'

import {
  CSSVariablesResolver,
  ColorSchemeScript,
  MantineProvider,
  MantineTheme,
  Progress
} from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { AccountProvider } from 'contexts/AccountContext'
import { AdminProvider } from 'contexts/AdminContext'

import { RouterProvider } from 'react-router-dom'
import { router } from 'Router'
import { lightTheme } from 'themes'
import { Notifications } from '@mantine/notifications'
import ReactGA from 'react-ga4'
import { Global, MantineEmotionProvider, emotionTransform } from '@mantine/emotion'
import { emotionCache } from './emotion'

const ENV = process.env.REACT_APP_ENV
const maintenanceStart = Date.UTC(2024, 9, 4, 7, 45)
const maintenanceEnd = Date.UTC(2024, 9, 4, 8, 45)

function GlobalStyles() {
  return (
    <Global
      styles={(theme: MantineTheme) => ({
        [theme.other.media.print]: {
          '#root': {
            display: 'none'
          }
        }
      })}
    />
  )
}

const EnvBanner = () => (
  <Progress.Root
    radius="xs"
    size={18}
    style={{ zIndex: 42069, opacity: 0.5, position: 'fixed', top: 0, left: 0, right: 0 }}
  >
    <Progress.Section value={100} color="pink">
      <Progress.Label>{ENV}</Progress.Label>
    </Progress.Section>
  </Progress.Root>
)

const MaintenanceBanner = () => (
  <Progress.Root
    radius="xs"
    size={30}
    style={{ zIndex: 42069, opacity: 0.5, position: 'fixed', top: 0, left: 0, right: 0 }}
  >
    <Progress.Section value={100} color="warning">
      <Progress.Label>
        Planned maintenance in progress {new Date(maintenanceStart).toLocaleString()} -{' '}
        {new Date(maintenanceEnd).toLocaleTimeString()} (Errors may occur)
      </Progress.Label>
    </Progress.Section>
  </Progress.Root>
)

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--mantine-color-error': theme.colors.error[3]
  },
  light: {
    '--mantine-color-error': theme.colors.error[3]
  },
  dark: {
    '--mantine-color-error': theme.colors.error[4]
  }
})

ReactGA.initialize('G-PX5B4P9KKM')

function App() {
  return (
    <AccountProvider>
      <AdminProvider>
        <MantineEmotionProvider cache={emotionCache}>
          <ColorSchemeScript forceColorScheme="light" />
          <MantineProvider
            theme={lightTheme}
            cssVariablesResolver={resolver}
            stylesTransform={emotionTransform}
            forceColorScheme="light"
          >
            <ModalsProvider>
              <GlobalStyles />
              <Notifications />
              {ENV && <EnvBanner />}
              <MaintenanceBanner />
              <RouterProvider router={router} />
            </ModalsProvider>
          </MantineProvider>
        </MantineEmotionProvider>
      </AdminProvider>
    </AccountProvider>
  )
}

export default App
