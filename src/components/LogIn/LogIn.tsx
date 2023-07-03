import useAccount from 'hooks/useAccount'
import {
  Container,
  Button,
  createStyles,
  Title,
  Group,
  Text,
  Stack,
  ThemeIcon,
  Flex
} from '@mantine/core'
import LogInBackground from 'resources/backgrounds/pattern.svg'
import AdExLogo from 'resources/logos/AdExLogo'
import { useMemo } from 'react'
import HelpIcon from 'resources/icons/Help'
import { ExternalAnchor } from 'components/common/customAnchor/CustomAnchor'

const useStyles = createStyles(() => {
  return {
    container: {
      // TODO: Change with a new background pattern
      backgroundImage: `url(${LogInBackground})`,
      backgroundRepeat: 'repeat-x'
    }
  }
})

function LogIn() {
  const { classes } = useStyles()
  const { connectWallet } = useAccount()
  const year = useMemo(() => new Date().getFullYear(), [])

  return (
    <Container fluid h="100vh" className={classes.container}>
      <Flex h="100%" pt="xl" pb="xl" direction="column" justify="space-between" align="center">
        <Stack>
          <div style={{ height: '100px' }}>
            <AdExLogo />
          </div>
        </Stack>
        <Stack>
          <Title align="center" order={1}>
            Welcome to AdEx
          </Title>
          <Title align="center" color="secondaryText" order={2}>
            Open-source, transparent & fraud-proof display advertising
          </Title>
        </Stack>
        <Stack>
          <Button variant="filled" size="xl" onClick={connectWallet}>
            Get Started
          </Button>
        </Stack>
        <Stack align="center">
          <Group spacing="xs">
            <ThemeIcon
              variant="outline"
              size="sm"
              color="secondaryText"
              style={{ border: 'none', background: 'none' }}
            >
              <HelpIcon />
            </ThemeIcon>
            {/* TODO: change the href  */}
            <ExternalAnchor color="secondaryText" href="https://mantine.dev/">
              Help Center
            </ExternalAnchor>
          </Group>
          <Text size="sm" color="secondaryText">
            ©{year} AdEx. All Rights Reserved.
          </Text>
          <Text size="sm" color="secondaryText">
            V.0.00.01
          </Text>
        </Stack>
      </Flex>
    </Container>
  )
}

export default LogIn
