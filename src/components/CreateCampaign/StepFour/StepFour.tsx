import { Paper, Stack } from '@mantine/core'
import CampaignDetailsRow from 'components/common/CampainDetailsRow/CampaignDetailsRow'
import useCreateCampaignData from 'hooks/useCreateCampaignData/useCreateCampaignData'
import { useMemo } from 'react'
import { CreateCampaignOverview } from 'types'

const StepFour = () => {
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
      {
        title: 'Limit average daily spending',
        value: advancedTargeInput.limitDailyAverageSpending ? 'Yes' : 'No'
      },
      {
        title: 'Aggressive bidding',
        value: advancedTargeInput.aggressiveBidding ? 'Yes' : 'No'
      },
      { title: 'Campaign Period', value: campaignPeriodFormatted },
      { title: 'Placements', value: formattedSelectedPlacement },
      { title: 'Device Type', value: formattedSelectedDevice },
      { title: 'Ad Format', value: adFormats },
      { title: 'Creatives', value: adUnitsFormatted, isColumn: true },
      { title: 'Selected Categories', value: formattedCats },
      { title: 'Selected Countries', value: formattedLocs }
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
      advancedTargeInput.limitDailyAverageSpending,
      advancedTargeInput.aggressiveBidding
    ]
  )

  const rows = useMemo(
    () =>
      campaignOverview.map((item: CreateCampaignOverview) => {
        const isLast = item === campaignOverview[campaignOverview.length - 1]
        const fullTitle = `${item.title}`

        return (
          <CampaignDetailsRow
            key={fullTitle}
            lighterColor
            title={fullTitle}
            value={item.value}
            textSize="sm"
            noBorder={isLast}
            column={item.isColumn}
          />
        )
      }),
    [campaignOverview]
  )

  return (
    <Paper p="md" withBorder bg="lightBackground">
      <Stack gap="xs">{rows}</Stack>
    </Paper>
  )
}

export default StepFour
