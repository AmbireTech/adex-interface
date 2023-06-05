import { Container, Grid, Flex, Title, Button } from '@mantine/core'
import DepositIcon from 'resources/icons/Deposit'
import CampaignIcon from 'resources/icons/Campaign'
import CustomCard from './CustomCard'

const GetStarted = () => {
  return (
    <Container>
      <Flex
        mt="25%"
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
              width={294}
              height={330}
              title="Step 1"
              text="Add funds to your account"
              icon={<DepositIcon size="60px" />}
              color="secondary"
            >
              <Button
                w="70%"
                size="lg"
                variant="filled"
                color="secondary"
                onClick={() => console.log('Add funds clicked')}
              >
                Add funds
              </Button>
            </CustomCard>
          </Grid.Col>
          <Grid.Col md={4} order={2} xs={12}>
            <CustomCard
              width={294}
              height={330}
              title="Step 2"
              text="Create a new campaign"
              icon={<CampaignIcon size="60px" />}
              color="secondary"
            >
              <Button
                w="70%"
                size="lg"
                variant="filled"
                color="secondary"
                p="0"
                onClick={() => console.log('Create a campaign clicked')}
              >
                Create a campaign
              </Button>
            </CustomCard>
          </Grid.Col>
          <Grid.Col md={4} order={3} xs={12}>
            <CustomCard
              width={300}
              height={100}
              text="Statments"
              iconLeft={<CampaignIcon size="24px" />}
              color="secondary"
              action={() => console.log('Statement clicked')}
            />
          </Grid.Col>
          <Grid.Col md={4} order={4} xs={12}>
            <CustomCard
              width={164}
              height={164}
              icon={<CampaignIcon size="60px" />}
              text="Desktop"
              color="brand"
              action={() => console.log('Desktop clicked')}
            />
          </Grid.Col>
        </Grid>
      </Flex>
    </Container>
  )
}

export default GetStarted
