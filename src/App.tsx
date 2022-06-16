import React from 'react';
import { Grommet } from 'grommet';
import theme from './theme';
import Root from './Root'
import AccountProvider from 'components/AccountProvider/AccountProvider'
import SafeProvider from 'lib/safe-apps-react-sdk'


function App() {
  return (
    <Grommet theme={theme} themeMode='dark' full>
      <SafeProvider>
        <AccountProvider>
          <Root />
        </AccountProvider>
      </SafeProvider>
    </Grommet>
  );
}

export default App;
