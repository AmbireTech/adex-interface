import { Box, useMantineTheme } from '@mantine/core'
import AdExLogo from 'resources/logos/AdExLogo'
import NavLink from 'components/SideNav/NavLink'

function NotFound404() {
  const theme = useMantineTheme()

  return (
    <Box>
      <AdExLogo
        text={
          // theme.colorScheme === 'dark'
          //   ? theme.white
          //   : // TODO: fix that
          theme.colors.brandDarker[3]
        }
      />
      404
      <NavLink to="/" label="Go HOME" />
    </Box>
  )
}

export default NotFound404
