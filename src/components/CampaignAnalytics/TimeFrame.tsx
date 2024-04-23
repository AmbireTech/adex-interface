import { useCallback, useEffect, useMemo, useState } from 'react'
import { Grid, Title, createStyles, Flex, Text } from '@mantine/core'
import TimeFrameChart from 'components/common/Chart/TimeFrameChart'
import { BaseAnalyticsData, AnalyticsPeriod, FilteredAnalytics, MetricsToShow } from 'types'
import { formatCurrency } from 'helpers'
import { useViewportSize } from '@mantine/hooks'
import ChartControlBtn from './ChartControlBtn'

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: theme.colors.mainBackground[theme.fn.primaryShade()],
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    boxShadow: theme.shadows.sm
  },
  lighterGray: {
    color: theme.fn.lighten(
      theme.colors.mainText[theme.fn.primaryShade()],
      theme.other.shades.lighten.lighter
    ),
    fontSize: theme.fontSizes.sm
  }
}))

function sumArrayProperties(analytics: BaseAnalyticsData[]) {
  const sums = analytics.reduce(
    (sum, x) => {
      const next = { ...sum }
      next.clicks += x.clicks
      next.impressions += x.impressions
      next.paid += x.paid

      return next
    },
    { clicks: 0, impressions: 0, paid: 0 }
  )

  return {
    ...sums,
    ctr: (sums.clicks / sums.impressions) * 100,
    avgCpm: (sums.paid / sums.impressions) * 1000
  }
}

export const TimeFrame = ({
  timeFrames,
  period,
  currencyName
}: {
  timeFrames: BaseAnalyticsData[] | undefined
  period: AnalyticsPeriod | undefined
  currencyName: string
}) => {
  const { classes } = useStyles()
  const { width: windowWidth } = useViewportSize()
  const [filteredData, setFilteredData] = useState<FilteredAnalytics[]>([])

  // console.log({ kors: Array.isArray(timeFrames) })

  const [metricsToShow, setMetricsToShow] = useState<MetricsToShow>({
    // segment: true,
    impressions: true,
    clicks: true,
    ctr: true,
    avgCpm: true,
    paid: true
  })

  useEffect(() => {
    if (timeFrames) {
      const result = timeFrames.map((obj) => {
        console.log({ obj })
        const filteredObj: FilteredAnalytics = {
          segment: new Date(Number(obj.segment)).toLocaleDateString()
        }

        Object.entries(metricsToShow).forEach(([metricKey, show]) => {
          if (show) {
            // TODO: fix it
            // @ts-ignore
            filteredObj[metricKey as keyof BaseAnalyticsData] =
              obj[metricKey as keyof BaseAnalyticsData]
          }
        })

        return filteredObj
      })
      setFilteredData(result)
    }
  }, [timeFrames, metricsToShow])

  const totalSum = useMemo(
    () =>
      timeFrames
        ? sumArrayProperties(timeFrames)
        : // TODO: default
          { clicks: 0, impressions: 0, avgCpm: 0, ctr: 0, paid: 0 },
    [timeFrames]
  )

  const handleMetricClick = useCallback((value: boolean, propNameToRemove: string) => {
    setMetricsToShow((prev) => ({ ...prev, [propNameToRemove]: value }))
  }, [])

  if (!timeFrames?.length) {
    return <div>No time frames found</div>
  }

  return (
    <Grid grow>
      <Grid.Col className={classes.wrapper}>
        <Grid>
          <Grid.Col span="content">
            <ChartControlBtn
              value={formatCurrency(totalSum.impressions, 0)}
              text="Total impressions"
              bgColor="chartColorOne"
              onClick={(v: boolean) => handleMetricClick(v, 'impressions')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value={`${formatCurrency(totalSum.clicks, 0)} (${formatCurrency(
                totalSum.ctr,
                2
              )} % CTR)`}
              text="Total clicks & CTR"
              bgColor="chartColorTwo"
              onClick={(v: boolean) => handleMetricClick(v, 'clickAndCRT')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value={`~ ${formatCurrency(totalSum.avgCpm, 3)} ${currencyName} / CPM`}
              text="Average CPM"
              bgColor="chartColorThree"
              onClick={(v: boolean) => handleMetricClick(v, 'averageCPM')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value={`~ ${formatCurrency(totalSum.paid, 2)} ${currencyName}`}
              text="Total spent"
              bgColor="chartColorFour"
              onClick={(v: boolean) => handleMetricClick(v, 'spent')}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col className={classes.wrapper}>
        <Title order={5}>Chart</Title>
        <TimeFrameChart
          width={windowWidth >= 768 ? windowWidth - 315 : windowWidth - 100}
          height={420}
          timeFrameData={filteredData}
          metricsToShow={metricsToShow}
        />
        {period && (
          <Flex align="center" justify="space-between" ml="xl" mr="xl">
            <Text className={classes.lighterGray}>Starts: {period.start.toString()}</Text>
            <Text className={classes.lighterGray}>Ends: {period.end.toString()}</Text>
          </Flex>
        )}
      </Grid.Col>
    </Grid>
  )
}
