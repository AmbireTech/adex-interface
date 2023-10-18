import { useState } from 'react'
import { Button, Flex, Grid, Group, Stepper, createStyles, Text } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import MobileIcon from 'resources/icons/Mobile'
import DesktopIcon from 'resources/icons/Desktop'
import { Devices } from 'types'
import BannerSizesList from './BannerSizesList'

const useStyles = createStyles((theme) => {
  return {
    // TODO: Think about the idea to add the common container styles in the theme
    container: {
      backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.xs,
      overflow: 'hidden',
      padding: theme.spacing.lg
    }
  }
})

const CreateCampaign = () => {
  const { classes } = useStyles()

  // Stepper
  const [active, setActive] = useState(1)
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current))
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current))

  // Mobile/Desktop tabs
  const [selectedTab, setSelectedTab] = useState<Devices | null>(null)

  return (
    <Grid mr="xl" ml="xl" mt="md">
      <Grid.Col span={8} className={classes.container}>
        <Grid p="md">
          <Grid.Col>
            <Stepper icon={' '} size="xs" active={active} onStepClick={setActive}>
              <Stepper.Step />
              <Stepper.Step />
              <Stepper.Step />
            </Stepper>

            <Group mt="xl">
              <Button variant="default" onClick={prevStep}>
                Back
              </Button>
              <Button onClick={nextStep}>Next step</Button>
            </Group>
          </Grid.Col>
          <Grid.Col>
            <Text color="secondaryText" size="sm" weight="bold" mb="xs">
              1. Select device
            </Text>
            <Flex gap={20}>
              <CustomCard
                width={164}
                height={164}
                icon={<MobileIcon size="60px" />}
                text="Mobile"
                color="brand"
                active={selectedTab === 'mobile'}
                action={() => setSelectedTab('mobile')}
              />
              <CustomCard
                width={164}
                height={164}
                icon={<DesktopIcon size="60px" />}
                text="Desktop"
                color="brand"
                active={selectedTab === 'desktop'}
                action={() => setSelectedTab('desktop')}
              />
            </Flex>
          </Grid.Col>
          <Grid.Col span={12}>
            {selectedTab && (
              <>
                <Text color="secondaryText" size="sm" weight="bold" mb="xs">
                  2. Select banner size
                </Text>
                <BannerSizesList selectedTab={selectedTab} />
              </>
            )}
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col span={3} offset={1} className={classes.container}>
        Test
      </Grid.Col>
    </Grid>
  )
}

export default CreateCampaign
