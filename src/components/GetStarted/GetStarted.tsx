import { Container, Grid, useMantineTheme, rem, Center, Title } from '@mantine/core'
import DepositIcon from 'resources/icons/Deposit'
import CampaignIcon from 'resources/icons/Campaign'
import CustomCard from './CustomCard'

const GetStarted = () => {
  const theme = useMantineTheme()
  return (
    <Container fluid h="100vh">
      <Center h="70%">
        <Grid grow justify="space-around" align="center">
          <Grid.Col>
            <Title order={3}>Get started with AdEx</Title>
          </Grid.Col>
          <Grid.Col md={1} order={1} xs={12}>
            <CustomCard
              title="Step 1"
              text="Add funds to your account"
              icon={<DepositIcon color={theme.colors.brand[3]} size={rem(60)} />}
              color={theme.colors.brand[3]}
              buttonLabel="Add funds"
              action={() => console.log('Add funds clicked')}
            />
          </Grid.Col>
          <Grid.Col md={4} order={2} xs={12}>
            <CustomCard
              title="Step 2"
              text="Create new campaign"
              icon={<CampaignIcon color={theme.colors.secondary[3]} size={rem(60)} />}
              color={theme.colors.secondary[3]}
              buttonLabel="Create a campaign"
              action={() => console.log('Create a campaign clicked')}
            />
          </Grid.Col>
        </Grid>
      </Center>
    </Container>
  )
}

export default GetStarted
