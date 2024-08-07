import { Box, getPrimaryShade, useMantineTheme } from '@mantine/core'
import AdExLogo from 'resources/logos/AdExLogo'
import NavLink from 'components/SideNav/NavLink'
import { useColorScheme } from '@mantine/hooks'

function NotFound404() {
  const theme = useMantineTheme()
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return (
    <Box>
      <AdExLogo
        // text={colorScheme === 'dark' ? theme.white : theme.colors.brandDarker[primaryShade]}
        text={theme.colors.brandDarker[primaryShade]}
      />
      404
      <NavLink to="/" label="Go HOME" />
    </Box>
  )
}

export default NotFound404
