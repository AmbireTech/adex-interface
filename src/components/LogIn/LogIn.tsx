import useAccount from 'hooks/useAccount'
import {
  Container,
  Button,
  createStyles,
  Image,
  Title,
  Group,
  Text,
  Stack,
  ThemeIcon,
  Flex
} from '@mantine/core'
import LogInBackground from 'resources/backgrounds/pattern.svg'
import PCimage from 'resources/images/pc@2x.png'
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
      <Flex h="100%" pt="md" pb="md" direction="column" justify="space-between">
        <Stack spacing="xl" align="center">
          <Stack spacing="xs" align="center">
            <div style={{ height: '100px' }}>
              <AdExLogo />
            </div>
            <Title order={1}>Welcome to AdEx</Title>
            <Title order={2}>Open-source, transparent & fraud-proof display advertising</Title>
          </Stack>
          {/* The image should be changed */}
          <Image src={PCimage} maw={600} />
          <Stack spacing="xs" align="center">
            <Button variant="filled" size="xl" onClick={connectWallet}>
              Get Started
            </Button>
            {/* TODO: change the href  */}
            <ExternalAnchor color="dimmed" href="https://mantine.dev/" target="_blank">
              FAQ/Tutorials
            </ExternalAnchor>
          </Stack>
        </Stack>
        <Group position="right">
          <Stack spacing="xs" align="center">
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
              <ExternalAnchor color="dimmed" href="https://mantine.dev/">
                Help Center
              </ExternalAnchor>
            </Group>
            <Text size="sm" color="dimmed">
              ©{year} AdEx. All Rights Reserved.
            </Text>
            <Text size="sm" color="dimmed">
              V.0.00.01
            </Text>
          </Stack>
        </Group>
      </Flex>
    </Container>
  )
}

export default LogIn
