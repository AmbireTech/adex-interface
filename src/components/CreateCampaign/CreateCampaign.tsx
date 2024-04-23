import { Grid, createStyles } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import CustomStepper from './CampaignStepper'
import CampaignSummary from './CampaignSummary'
import StepOne from './StepOne/StepOne'
import StepTwo from './StepTwo/StepTwo'
import StepThree from './StepThree/StepThree'
import StepFour from './StepFour/StepFour'

const useStyles = createStyles((theme) => {
  return {
    // TODO: Think about the idea to add the common container styles in the theme
    container: {
      backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
      borderRadius: theme.radius.md,
      boxShadow: theme.shadows.xs
      // padding: theme.spacing.lg
    },
    lightGray: {
      color: theme.fn.lighten(
        theme.colors.secondaryText[theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      )
    },
    dropZone: {
      backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
      border: '1px solid',
      borderRadius: theme.radius.sm,
      borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
      height: 112
    },
    decorativeBorder: {
      width: '99%',
      height: '99%',
      border: '1px dashed',
      borderRadius: theme.radius.sm
    }
  }
})

const Wizard = ({ step }: { step: number }) => {
  switch (step) {
    case 0:
      return <StepOne />
    case 1:
      return <StepTwo />
    case 2:
      return <StepThree />
    case 3:
      return <StepFour />
    default:
      return null
  }
}

const CreateCampaign = () => {
  const { classes } = useStyles()
  const {
    campaign: { step }
  } = useCreateCampaignContext()

  return (
    <Grid columns={24} align="flex-start" mr="xl" ml="xl" mt="md">
      <Grid.Col sm={24} md={15} lg={18} className={classes.container} p="lg">
        <Grid p="md">
          <Grid.Col>
            <CustomStepper />
          </Grid.Col>
          <Grid.Col>
            <Wizard step={step} />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col
        sm={24}
        md={8}
        lg={5}
        offset={1}
        className={classes.container}
        style={{ height: 'auto', padding: 0 }}
      >
        <CampaignSummary />
      </Grid.Col>
    </Grid>
  )
}

export default CreateCampaign
