import { Container, createStyles } from '@mantine/core'
import CampaignDetailsRow from 'components/common/CampainDetailsRow/CampaignDetailsRow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import { useMemo } from 'react'
import { CreateCampaignOverview } from 'types'

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
    advancedTargeInput,
    adFormats,
    campaignBudgetFormatted,
    campaignNameFormatted,
    adUnitsFormatted,
    campaignPeriodFormatted,
    formattedSelectedPlacement
  } = useCreateCampaignData()

  const campaignOverview: CreateCampaignOverview[] = useMemo(
    () => [
      { title: 'Campaign Name', value: campaignNameFormatted },
      { title: 'Campaign Budget', value: campaignBudgetFormatted },
      { title: 'CPM', value: priceBoundsFormatted },
      { title: 'Campaign Period', value: campaignPeriodFormatted },
      { title: 'Placements', value: formattedSelectedPlacement },
      { title: 'Device Type', value: formattedSelectedDevice },
      { title: 'Ad Format', value: adFormats },
      { title: 'Creatives', value: adUnitsFormatted },
      { title: 'Selected Categories', value: formattedCats },
      { title: 'Selected Countries', value: formattedLocs },
      // {
      //   title: 'Include incentivized traffic',
      //   value: advancedTargeInput.includeIncentivized ? 'Yes' : 'No'
      // },
      // {
      //   title: 'Disable frequency capping',
      //   value: advancedTargeInput.disableFrequencyCapping ? 'Yes' : 'No'
      // },
      {
        title: 'Limit average daily spending',
        value: advancedTargeInput.limitDailyAverageSpending ? 'Yes' : 'No'
      }
    ],
    [
      campaignNameFormatted,
      campaignBudgetFormatted,
      priceBoundsFormatted,
      campaignPeriodFormatted,
      formattedSelectedPlacement,
      formattedSelectedDevice,
      adFormats,
      adUnitsFormatted,
      formattedCats,
      formattedLocs,
      advancedTargeInput.limitDailyAverageSpending
    ]
  )

  const rows = useMemo(
    () =>
      campaignOverview.map((item: CreateCampaignOverview, i) => {
        const isLast = item === campaignOverview[campaignOverview.length - 1]
        const isColumn = item.title === 'Creatives'
        const fullTitle = `${i + 1}. ${item.title}`

        return (
          <CampaignDetailsRow
            key={fullTitle}
            lighterColor
            title={fullTitle}
            value={item.value}
            textSize="sm"
            noBorder={isLast}
            column={isColumn}
          />
        )
      }),
    [campaignOverview]
  )

  return <Container className={classes.wrapper}>{rows}</Container>
}

export default StepFour
