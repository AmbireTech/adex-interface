import { useEffect, useMemo, useState } from 'react'
import { Grid, Title, createStyles, Flex, Text } from '@mantine/core'
import TimeFrameChart from 'components/common/Chart/TimeFrameChart'
import { IPeriod, ITimeFrameData } from 'types'
import { formatCurrency } from 'helpers'
import useWindowSize from 'hooks/useWindowSize'
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

function sumArrayProperties(array: ITimeFrameData[]) {
  const result = {} as ITimeFrameData
  array.forEach((obj) => {
    Object.keys(obj).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] === 'number' && key) {
        result[key] = (result[key] || 0) + obj[key]
      }
    })
  })

  return result
}

const TimeFrame = ({
  timeFrames,
  period
}: {
  timeFrames: ITimeFrameData[] | undefined
  period: IPeriod | undefined
}) => {
  const { classes } = useStyles()
  const [windowWidth] = useWindowSize()
  const [filteredData, setFilteredData] = useState<any[]>([])

  if (!timeFrames?.length) {
    return <div>No time frames found</div>
  }
  const [metricsToShow, setMetricsToShow] = useState({
    date: true,
    impressions: true,
    clickAndCRT: true,
    averageCPM: true,
    spent: true
  })

  useEffect(() => {
    const result = timeFrames.map((obj) => {
      const filteredObj = {} as any

      Object.keys(obj).forEach((prop) => {
        if ((metricsToShow as Record<string, boolean>)[prop]) {
          filteredObj[prop] = obj[prop]
        }
      })

      return filteredObj
    })
    setFilteredData(result)
  }, [timeFrames, metricsToShow])

  const totalSum = useMemo(() => sumArrayProperties(timeFrames), [timeFrames])

  const handleImpressionsClick = (value: boolean, propNameToRemove: string) => {
    setMetricsToShow((prev) => ({ ...prev, [propNameToRemove]: value }))
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
              onClick={(v: boolean) => handleImpressionsClick(v, 'impressions')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value={`${formatCurrency(totalSum.clickAndCRT, 0)} (${formatCurrency(
                (totalSum.clickAndCRT / totalSum.impressions) * 100,
                2
              )} % CTR)`}
              text="Total clicks & CTR"
              bgColor="chartColorTwo"
              onClick={(v: boolean) => handleImpressionsClick(v, 'clickAndCRT')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              // TODO: calculate average DAI/CPM
              value={`~ ${formatCurrency(totalSum.averageCPM, 3)} DAI / CPM`}
              text="Average CPM"
              bgColor="chartColorThree"
              onClick={(v: boolean) => handleImpressionsClick(v, 'averageCPM')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value={`~ ${formatCurrency(totalSum.spent, 2)} DAI`}
              text="Total spent"
              bgColor="chartColorFour"
              onClick={(v: boolean) => handleImpressionsClick(v, 'spent')}
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
            <Text className={classes.lighterGray}>Starts: {period.from}</Text>
            <Text className={classes.lighterGray}>Ends: {period.to}</Text>
          </Flex>
        )}
      </Grid.Col>
    </Grid>
  )
}

export default TimeFrame
