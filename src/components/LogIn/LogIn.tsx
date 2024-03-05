import useAccount from 'hooks/useAccount'
import {
  Container,
  Button,
  createStyles,
  Title,
  Group,
  Text,
  ThemeIcon,
  Flex,
  rem,
  useMantineTheme
} from '@mantine/core'
import LogInBackground from 'resources/backgrounds/pattern.svg'
import LowerShape from 'resources/backgrounds/lowerShape.svg'
import UpperShape from 'resources/backgrounds/upperShape.svg'
import AdExLogo from 'resources/logos/AdExLogo'
import { useEffect, useMemo } from 'react'
import HelpIcon from 'resources/icons/Help'
import CustomAnchor from 'components/common/customAnchor/CustomAnchor'
import { useNavigate } from 'react-router-dom'

const useStyles = createStyles(() => {
  return {
    container: {
      backgroundImage: `url(${LowerShape}), url(${UpperShape}), url(${LogInBackground})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain, contain, 120%'
    },
    logoContainer: {
      width: rem(191)
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
  const { connectWallet, authenticated } = useAccount()
  const year = useMemo(() => new Date().getFullYear(), [])
  const theme = useMantineTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (authenticated) navigate('/get-started', { replace: true })
  }, [authenticated, navigate])

  return (
    <Container fluid h="100vh" className={classes.container}>
      <Flex h="100%" pt="xl" pb="xl" direction="column" justify="space-around" align="center">
        <div className={classes.logoContainer}>
          <AdExLogo
            text={
              theme.colorScheme === 'dark'
                ? theme.white
                : theme.colors.brandDarker[theme.fn.primaryShade()]
            }
          />
        </div>
        <div>
          <Title align="center" order={1}>
            Welcome to AdEx
          </Title>
          <Title className={classes.subTitle} align="center" color="secondaryText" order={2}>
            Open-source, transparent & fraud-proof display advertising
          </Title>
        </div>
        <Button variant="filled" size="xl" onClick={connectWallet}>
          Get Started
        </Button>
        <Flex direction="column" align="center">
          <Group mb="sm" spacing="xs">
            <ThemeIcon variant="outline" size="sm" color="secondaryText" className={classes.icon}>
              <HelpIcon />
            </ThemeIcon>
            <CustomAnchor external href="https://mantine.dev/" color="dimmed">
              Help Center
            </CustomAnchor>
          </Group>
          <Text size="sm" color="secondaryText">
            ©{year} AdEx. All Rights Reserved.
          </Text>
          <Text size="sm" color="secondaryText">
            V.0.00.01
          </Text>
        </Flex>
      </Flex>
    </Container>
  )
}

export default LogIn
