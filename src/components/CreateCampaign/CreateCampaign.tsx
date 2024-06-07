import { Grid, createStyles, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useEffect } from 'react'
import { modals } from '@mantine/modals'
import useCustomNotifications from 'hooks/useCustomNotifications'
import useCampaignsData from 'hooks/useCampaignsData'
import { deepEqual } from 'helpers/createCampaignHelpers'
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
    setCampaign,
    campaign: { step },
    saveToDraftCampaign,
    defaultValue
  } = useCreateCampaignContext()
  const { updateAllCampaignsData } = useCampaignsData()
  const { showNotification } = useCustomNotifications()

  useEffect(() => {
    return () => {
      // NOTE: because of the strict mode on dev env it invokes twice
      if (process.env.NODE_ENV !== 'development') {
        setCampaign((prev) => {
          if (!deepEqual(prev, defaultValue)) {
            modals.openConfirmModal({
              title: 'You may have unsaved changes',
              children: (
                <Text size="sm">
                  You may have unsaved changes. Do you want to save them as a draft?
                </Text>
              ),
              labels: { confirm: 'Yes', cancel: 'No' },
              onCancel: () => console.log('No'),
              onConfirm: async () => {
                try {
                  const res = await saveToDraftCampaign(prev)

                  if (res && res.success) {
                    await updateAllCampaignsData()
                  } else {
                    showNotification('warning', 'invalid campaign data response', 'Data error')
                  }
                } catch (err) {
                  console.error(err)
                  showNotification('error', 'Creating campaign failed', 'Data error')
                }
              }
            })
          }

          return prev
        })
      }
    }
  }, []) // eslint-disable-line

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
