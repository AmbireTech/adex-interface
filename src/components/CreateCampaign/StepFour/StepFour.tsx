import { Container, createStyles } from '@mantine/core'
import CampaignDetailsRow from 'components/common/Modals/CampaignDetailsModal/CampaignDetailsRow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'

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
    formattedSelectedDevice,
    priceBoundsFormatted,
    formattedCats,
    formattedLocs,
    adFormats,
    campaignBudgetFormatted,
    campaignNameFormatted,
    adUnitsFormatted,
    campaignPeriodFormatted
  } = useCreateCampaignData()

  return (
    <Container className={classes.wrapper}>
      <CampaignDetailsRow
        lighterColor
        title="1. Campaign Name"
        value={campaignNameFormatted}
        textSize="sm"
      />
      <CampaignDetailsRow
        lighterColor
        title="2. Campaign Budget"
        value={campaignBudgetFormatted}
        textSize="sm"
      />
      <CampaignDetailsRow lighterColor title="3. CPM" value={priceBoundsFormatted} textSize="sm" />
      <CampaignDetailsRow
        lighterColor
        title="4. Campaign Period"
        value={campaignPeriodFormatted}
        textSize="sm"
      />
      <CampaignDetailsRow
        lighterColor
        title="5. Device Type"
        value={formattedSelectedDevice}
        textSize="sm"
      />
      <CampaignDetailsRow lighterColor title="6. Ad Format" value={adFormats} textSize="sm" />
      <CampaignDetailsRow
        column
        lighterColor
        title="7. Creatives"
        value={adUnitsFormatted}
        textSize="sm"
      />
      <CampaignDetailsRow
        lighterColor
        title="8. Selected Categories"
        value={formattedCats}
        textSize="sm"
      />
      <CampaignDetailsRow
        lighterColor
        title="9. Selected Countries"
        value={formattedLocs}
        noBorder
      />
    </Container>
  )
}

export default StepFour
