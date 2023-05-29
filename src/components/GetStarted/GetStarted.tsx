import { Container, Grid, Flex, Title } from '@mantine/core'
import DepositIcon from 'resources/icons/Deposit'
import CampaignIcon from 'resources/icons/Campaign'
import CustomCard from './CustomCard'

const GetStarted = () => {
  return (
    <Container fluid h="100vh">
      <Flex
        h="60%"
        mih={50}
        gap="sm"
        justify="space-around"
        align="center"
        direction="column"
        wrap="wrap"
      >
        <Grid grow justify="center" align="center">
          <Grid.Col>
            <Title order={3}>Get started with AdEx</Title>
          </Grid.Col>
          <Grid.Col md={1} order={1} xs={12}>
            <CustomCard
              title="Step 1"
              text="Add funds to your account"
              icon={<DepositIcon />}
              color="brand"
              buttonLabel="Add funds"
              action={() => console.log('Add funds clicked')}
            />
          </Grid.Col>
          <Grid.Col md={4} order={2} xs={12}>
            <CustomCard
              title="Step 2"
              text="Create new campaign"
              icon={<CampaignIcon />}
              color="secondary"
              buttonLabel="Create a campaign"
              action={() => console.log('Create a campaign clicked')}
              isBtnFilled
            />
          </Grid.Col>
        </Grid>
      </Flex>
    </Container>
  )
}

export default GetStarted
