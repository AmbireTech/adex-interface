import { Box } from '@mantine/core'
import AdExLogo from 'resources/logos/AdExLogo'
import NavLink from 'components/SideNav/NavLink'

function NotFound404() {
  return (
    <Box c="brandDarker">
      <AdExLogo />
      404
      <NavLink to="/" label="Go HOME" />
    </Box>
  )
}

export default NotFound404
