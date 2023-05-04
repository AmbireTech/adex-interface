import { MantineProvider } from '@mantine/core'
import { AccountProvider } from 'contexts/AccountContext'
import Root from 'Root'

function App() {
  return (
    <AccountProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Root />
      </MantineProvider>
    </AccountProvider>
  )
}

export default App
