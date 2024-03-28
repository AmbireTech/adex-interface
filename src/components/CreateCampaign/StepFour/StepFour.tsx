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
    adFormats,
    campaignBudgetFormatted,
    campaignNameFormatted,
    adUnitsFormatted,
    campaignPeriodFormatted
  } = useCreateCampaignData()

  const campaignOverview: CreateCampaignOverview[] = useMemo(
    () => [
      { count: 1, title: 'Campaign Name', value: campaignNameFormatted },
      { count: 2, title: 'Campaign Budget', value: campaignBudgetFormatted },
      { count: 3, title: 'CPM', value: priceBoundsFormatted },
      { count: 4, title: 'Campaign Period', value: campaignPeriodFormatted },
      { count: 5, title: 'Device Type', value: formattedSelectedDevice },
      { count: 6, title: 'Ad Format', value: adFormats },
      { count: 7, title: 'Creatives', value: adUnitsFormatted },
      { count: 8, title: 'Selected Categories', value: formattedCats },
      { count: 9, title: 'Selected Countries', value: formattedLocs }
    ],
    [
      formattedSelectedDevice,
      priceBoundsFormatted,
      formattedCats,
      formattedLocs,
      adFormats,
      campaignBudgetFormatted,
      campaignNameFormatted,
      adUnitsFormatted,
      campaignPeriodFormatted
    ]
  )

  const rows = useMemo(
    () =>
      campaignOverview.map((item: CreateCampaignOverview) => {
        const isLast = item === campaignOverview[campaignOverview.length - 1]
        const isColumn = item.title === 'Creatives'
        const fullTitle = `${item.count}. ${item.title}`

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
