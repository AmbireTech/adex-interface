import { Container, Grid, Flex, Title, Button, Text } from '@mantine/core'
import DepositIcon from 'resources/icons/Deposit'
import CampaignIcon from 'resources/icons/Campaign'
import CustomCard from 'components/common/CustomCard'
import AddSignerIcon from 'resources/icons/AddSigner'
import { useNavigate } from 'react-router-dom'
import CustomPopover from 'components/common/CustomPopover'
import { IS_MANUAL_DEPOSITING } from 'constants/balances'
import useAccount from 'hooks/useAccount'
import { useMemo } from 'react'

const GetStarted = () => {
  const navigate = useNavigate()
  const {
    adexAccount: { availableBalance }
  } = useAccount()

  const hasAvailableBalance = useMemo(
    () => availableBalance && availableBalance > 0,
    [availableBalance]
  )

  const hasPopover = useMemo(
    () => Boolean(IS_MANUAL_DEPOSITING) && !hasAvailableBalance,
    [hasAvailableBalance]
  )
  return (
    <Container m={0}>
      <Flex mih={50} gap="sm" justify="space-around" align="center" direction="column" wrap="wrap">
        <Grid grow justify="center" align="center">
          <Grid.Col>
            <Title order={3}>Get started with AdEx</Title>
          </Grid.Col>
          <Grid.Col md={1} order={1} xs={12}>
            <CustomCard
              width={294}
              height={330}
              title="Step 1"
              text="Fill in company details"
              icon={<AddSignerIcon strokeWidth="1" size="60px" />}
              color="secondary"
            >
              <Button
                w="70%"
                size="lg"
                variant="filled"
                color="secondary"
                onClick={() => navigate('/dashboard/billing')}
              >
                Add details
              </Button>
            </CustomCard>
          </Grid.Col>
          <Grid.Col md={4} order={2} xs={12}>
            <CustomCard
              width={294}
              height={330}
              title="Step 2"
              text="Add funds to your account"
              icon={<DepositIcon size="60px" />}
              color="secondary"
            >
              {hasPopover ? (
                <CustomPopover
                  popoverContent={
                    <Text size="sm">
                      Contact us on <a href="mailto: dsp@adex.network"> dsp@adex.network</a> to
                      &quot;add money&quot; / &quot;launch campaign&quot;
                    </Text>
                  }
                >
                  <Button w="70%" size="lg" variant="filled" color="secondary">
                    Add funds
                  </Button>
                </CustomPopover>
              ) : (
                <Button
                  w="70%"
                  size="lg"
                  variant="filled"
                  color="secondary"
                  onClick={() => navigate('/dashboard/deposit')}
                >
                  Add funds
                </Button>
              )}
            </CustomCard>
          </Grid.Col>
          <Grid.Col md={4} order={3} xs={12}>
            <CustomCard
              width={294}
              height={330}
              title="Step 3"
              text="Create a new campaign"
              icon={<CampaignIcon size="60px" />}
              color="secondary"
            >
              {hasPopover ? (
                <CustomPopover
                  popoverContent={
                    <Text size="sm">
                      Contact us on <a href="mailto: dsp@adex.network"> dsp@adex.network</a> to
                      &quot;add money&quot; / &quot;launch campaign&quot;
                    </Text>
                  }
                >
                  <Button w="70%" size="lg" variant="filled" color="secondary" p="0">
                    Create a campaign
                  </Button>
                </CustomPopover>
              ) : (
                <Button
                  w="70%"
                  size="lg"
                  variant="filled"
                  color="secondary"
                  p="0"
                  onClick={() => navigate('/dashboard/create-campaign')}
                >
                  Create a campaign
                </Button>
              )}
            </CustomCard>
          </Grid.Col>
        </Grid>
      </Flex>
    </Container>
  )
}

export default GetStarted
