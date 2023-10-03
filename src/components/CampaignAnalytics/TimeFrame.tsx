import { useState } from 'react'
import { Grid, Title, createStyles } from '@mantine/core'
import { ParentSize } from '@visx/responsive'
import TimeFrameChart from 'components/common/Chart/TimeFrameChart'
import { ITimeFrameData } from 'types'
import { formatCurrency } from 'helpers'
import ChartControlBtn from './ChartControlBtn'

const useStyles = createStyles((theme) => ({
  wrapper: {
    background: 'white',
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    boxShadow: theme.shadows.sm
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

const TimeFrame = ({ timeFrames }: { timeFrames: ITimeFrameData[] | undefined }) => {
  const { classes } = useStyles()
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

  const filteredData = timeFrames.map((obj) => {
    const filteredObj = {} as any

    Object.keys(obj).forEach((prop) => {
      if ((metricsToShow as Record<string, boolean>)[prop]) {
        filteredObj[prop] = obj[prop]
      }
    })

    return filteredObj
  })

  const totalSum = sumArrayProperties(timeFrames)

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
      <Grid.Col className={classes.wrapper} h={420}>
        <Title order={5}>Chart</Title>
        <ParentSize>
          {({ width, height }) => (
            <TimeFrameChart
              width={width}
              height={height - 20}
              timeFrameData={filteredData}
              metricsToShow={metricsToShow}
            />
          )}
        </ParentSize>
      </Grid.Col>
    </Grid>
  )
}

export default TimeFrame
