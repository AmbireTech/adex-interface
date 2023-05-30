import useAccount from 'hooks/useAccount'
import {
  Container,
  Grid,
  Button,
  Center,
  createStyles,
  Image,
  Title,
  Group,
  Text,
  Stack,
  UnstyledButton,
  ThemeIcon,
  Anchor
} from '@mantine/core'
import LogInBackground from 'resources/backgrounds/pattern.svg'
import PCimage from 'resources/images/pc.png'
import AdExLogo from 'resources/logos/AdExLogo'
import { useMemo } from 'react'
import HelpIcon from 'resources/icons/Help'

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
      <Grid grow h="100%" justify="stretch" align="center">
        <Grid.Col md={12} order={1} xs={12} orderXs={1} orderMd={1}>
          <Grid grow justify="stretch" align="center">
            <Grid.Col h="100px">
              <Center h="100%">
                <AdExLogo />
              </Center>
            </Grid.Col>
            <Grid.Col>
              <Center h="100%">
                <Title order={1}>Welcome to AdEx</Title>
              </Center>
            </Grid.Col>
            <Grid.Col>
              <Center h="100%">
                <Title order={2}>Open-source, transparent & fraud-proof display advertising</Title>
              </Center>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col md={12} order={2} xs={12} orderXs={2} orderMd={2}>
          <Center h="100%">
            <Image src={PCimage} maw={553} />
          </Center>
        </Grid.Col>
        <Grid.Col md={12} order={3} xs={12} orderXs={3} orderMd={3}>
          <Stack spacing="xs" align="center">
            <Button variant="outline" size="xl" onClick={connectWallet}>
              Get Started
            </Button>
            {/* TODO: change the href  */}
            <Anchor color="dimmed" href="https://mantine.dev/" target="_blank">
              FAQ/Tutorials
            </Anchor>
          </Stack>
        </Grid.Col>
        <Grid.Col md={12} order={4} xs={12} orderXs={4} orderMd={4}>
          <Group position="right">
            <Stack spacing="xs" align="center">
              <UnstyledButton>
                <Group spacing="xs">
                  <ThemeIcon
                    variant="outline"
                    size={20}
                    color="gray.6"
                    style={{ border: 'none', background: 'none' }}
                  >
                    <HelpIcon />
                  </ThemeIcon>
                  {/* TODO: change the href  */}
                  <Anchor color="dimmed" href="https://mantine.dev/" target="_blank">
                    Help Center
                  </Anchor>
                </Group>
              </UnstyledButton>
              <Text size="sm" color="dimmed">
                ©{year} AdEx. All Rights Reserved.
              </Text>
              <Text size="sm" color="dimmed">
                V.0.00.01
              </Text>
            </Stack>
          </Group>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default LogIn
