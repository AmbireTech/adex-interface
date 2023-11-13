import { Grid, createStyles } from '@mantine/core'
import CustomStepper from './CampaignStepper'
import CampaignSummary from './CampaignSummary'
import SelectDevice from './SelectDevice'
import UploadCreative from './UploadCreative'

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

const CreateCampaign = () => {
  const { classes } = useStyles()

  return (
    <Grid mr="xl" ml="xl" mt="md">
      <Grid.Col span={8} className={classes.container} p="lg">
        <Grid p="md">
          <Grid.Col>
            <CustomStepper />
          </Grid.Col>
          <Grid.Col>
            <SelectDevice />
          </Grid.Col>
          <Grid.Col>
            <UploadCreative />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col
        span={3}
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
