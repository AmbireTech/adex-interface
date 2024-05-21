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
  useMantineTheme,
  LoadingOverlay
} from '@mantine/core'
import LogInBackground from 'resources/backgrounds/pattern.svg'
import LowerShape from 'resources/backgrounds/lowerShape.svg'
import UpperShape from 'resources/backgrounds/upperShape.svg'
import AdExLogo from 'resources/logos/AdExLogo'
import { useCallback, useEffect, useMemo } from 'react'
import HelpIcon from 'resources/icons/Help'
import CustomAnchor from 'components/common/customAnchor/CustomAnchor'
import { useNavigate } from 'react-router-dom'
import useAccount from 'hooks/useAccount'
import { appVersion } from 'helpers'
import { useDisclosure } from '@mantine/hooks'

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
  const { connectWallet, authenticated, isLoading } = useAccount()
  const year = useMemo(() => new Date().getFullYear(), [])
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const [visible, { toggle }] = useDisclosure(false)

  useEffect(() => {
    if (authenticated) navigate('/dashboard/get-started', { replace: true })
  }, [authenticated, navigate])

  useEffect(() => {
    if (isLoading) toggle()
    // NOTE: adding toggle func in the dependency array provoke multiple re-rendering
  }, [isLoading]) // eslint-disable-line

  const handleGetStartedBtnClicked = useCallback(() => connectWallet(), [connectWallet])
  return (
    <Container fluid h="100vh" className={classes.container}>
      <LoadingOverlay visible={visible} transitionDuration={500} overlayBlur={2} />
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
            Reach Beyond Web3
          </Title>
        </div>
        <Button variant="filled" size="xl" onClick={handleGetStartedBtnClicked}>
          Get Started
        </Button>
        <Flex direction="column" align="center">
          <Group mb="sm" spacing="xs">
            <ThemeIcon variant="outline" size="sm" color="secondaryText" className={classes.icon}>
              <HelpIcon />
            </ThemeIcon>
            <CustomAnchor external href="https://help.adex.network/hc/en-us" color="dimmed">
              Help Center
            </CustomAnchor>
          </Group>
          <Text size="sm" color="secondaryText">
            ©{year} AdEx. All Rights Reserved.
          </Text>
          <Text size="sm" color="secondaryText">
            V.{appVersion}
          </Text>
        </Flex>
      </Flex>
    </Container>
  )
}

export default LogIn
