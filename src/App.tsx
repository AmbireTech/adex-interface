import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import '@mantine/dropzone/styles.css'

import { ColorSchemeScript, MantineProvider, MantineTheme, Progress } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { AccountProvider } from 'contexts/AccountContext'

import { RouterProvider } from 'react-router-dom'
import { router } from 'Router'
import { lightTheme } from 'themes'
import { Notifications } from '@mantine/notifications'
import ReactGA from 'react-ga4'
import { Global, MantineEmotionProvider, emotionTransform } from '@mantine/emotion'
// import { emotionCache } from './emotion'

const ENV = process.env.REACT_APP_ENV

function GlobalStyles() {
  return (
    <Global
      styles={(theme: MantineTheme) => ({
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

ReactGA.initialize('G-PX5B4P9KKM')

function App() {
  return (
    <AccountProvider>
      <MantineEmotionProvider>
        <ColorSchemeScript forceColorScheme="light" />
        <MantineProvider
          theme={lightTheme}
          stylesTransform={emotionTransform}
          forceColorScheme="light"
        >
          <ModalsProvider>
            <GlobalStyles />
            <Notifications />
            {ENV && <EnvBanner />}
            <RouterProvider router={router} />
          </ModalsProvider>
        </MantineProvider>
      </MantineEmotionProvider>
    </AccountProvider>
  )
}

export default App
