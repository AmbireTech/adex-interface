import React from 'react';
import { Grommet } from 'grommet';
import theme from './theme';
import Root from './Root'
import AccountProvider from 'components/AccountProvider/AccountProvider'


function App() {
  return (
    <Grommet theme={theme} themeMode='dark' full>
      <AccountProvider>
        <Root />
      </AccountProvider>
    </Grommet>
  );
}

export default App;
