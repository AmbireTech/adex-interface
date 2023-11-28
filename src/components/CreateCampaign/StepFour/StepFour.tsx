import { Container, createStyles } from '@mantine/core'
import CampaignDetailsRow from 'components/common/Modals/CampaignDetailsModal/CampaignDetailsRow'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderRadius: theme.radius.md,
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    maxWidth: '100%'
  }
}))

const StepFour = () => {
  const { classes } = useStyles()
  const {
    campaign: { device }
  } = useCreateCampaignContext()

  return (
    <Container className={classes.wrapper}>
      <CampaignDetailsRow lighterColor title="1. Campaign Name" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="2. Campaign Budget" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="3. CPM" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="4. Campaign Period" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="5. Device Type" value={device} textSize="sm" />
      <CampaignDetailsRow lighterColor title="6. Ad Format" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="7. Creatives" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="8. Selected Categories" value="-" textSize="sm" />
      <CampaignDetailsRow lighterColor title="9. Selected Countries" value="-" noBorder />
    </Container>
  )
}

export default StepFour
