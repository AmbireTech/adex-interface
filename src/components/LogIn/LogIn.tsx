import {
  Container,
  Button,
  Title,
  Group,
  Text,
  ThemeIcon,
  Flex,
  rem,
  LoadingOverlay,
  Box
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import LogInBackground from 'resources/backgrounds/pattern.svg'
import LowerShape from 'resources/backgrounds/lowerShape.svg'
import UpperShape from 'resources/backgrounds/upperShape.svg'
import AdExLogo from 'resources/logos/AdExLogo'
import { useEffect, useMemo } from 'react'
import HelpIcon from 'resources/icons/Help'
import CustomAnchor from 'components/common/customAnchor/CustomAnchor'
import { useNavigate } from 'react-router-dom'
import useAccount from 'hooks/useAccount'
import { appVersion } from 'helpers'

const useStyles = createStyles(() => {
  return {
    container: {
      backgroundImage: `url(${LowerShape}), url(${UpperShape}), url(${LogInBackground})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain, contain, 120%'
    },
    icon: {
      border: 'none',
      background: 'none'
    },
    subTitle: {
      maxWidth: rem(800)
    }
  }
})

function LogIn() {
  const { classes } = useStyles()
  const { connectWallet, authenticated, isLoading } = useAccount()
  const year = useMemo(() => new Date().getFullYear(), [])
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'AdEx Login'
  }, [])

  useEffect(() => {
    if (authenticated) navigate('/dashboard', { replace: true })
  }, [authenticated, navigate])

  return (
    <Container fluid h="100vh" className={classes.container}>
      <LoadingOverlay
        visible={isLoading}
        transitionProps={{ transition: 'fade', duration: 500 }}
        overlayProps={{ blur: 2 }}
      />
      <Flex h="100%" pt="xl" pb="xl" direction="column" justify="space-around" align="center">
        <Box c="brandDarker" w={191}>
          <AdExLogo />
        </Box>
        <div>
          <Title ta="center" order={1}>
            Welcome to AdEx
          </Title>
          <Title className={classes.subTitle} ta="center" c="secondaryText" order={2}>
            Reach Beyond Web3
          </Title>
        </div>
        <Button variant="filled" size="xl" onClick={connectWallet}>
          Get Started
        </Button>
        <Flex direction="column" align="center">
          <Group mb="sm" gap="xs">
            <ThemeIcon variant="outline" size="sm" color="secondaryText" className={classes.icon}>
              <HelpIcon />
            </ThemeIcon>
            <CustomAnchor external href="https://help.adex.network/hc/en-us" c="dimmed">
              Help Center
            </CustomAnchor>
          </Group>
          <Text size="sm" c="secondaryText">
            ©{year} AdEx. All Rights Reserved.
          </Text>
          <Text size="sm" c="secondaryText">
            V.{appVersion}-beta
          </Text>
        </Flex>
      </Flex>
    </Container>
  )
}

export default LogIn
