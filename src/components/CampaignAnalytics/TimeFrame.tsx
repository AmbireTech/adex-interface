import { useState } from 'react'
import { Grid } from '@mantine/core'
import { ParentSize } from '@visx/responsive'
import TimeFrameChart from 'components/common/Chart/TimeFrameChart'
import { ITimeFrameData } from 'types'
import ChartControlBtn from './ChartControlBtn'

const TimeFrame = ({ timeFrames }: { timeFrames: ITimeFrameData[] | undefined }) => {
  if (!timeFrames?.length) {
    return <div>No time frames found</div>
  }
  const [metricsToShow, setMetricsToShow] = useState({
    impressions: true,
    clickAndCRT: true,
    averageCPM: true,
    spent: true
  })

  const handleImpressionsClick = (value: boolean, propNameToRemove: string) => {
    setMetricsToShow((prev) => ({ ...prev, [propNameToRemove]: value }))
  }

  return (
    <Grid grow>
      <Grid.Col>
        <Grid>
          <Grid.Col span="content">
            <ChartControlBtn
              value="1235"
              text="Total impressions"
              bgColor="chartColorOne"
              onClick={(v: boolean) => handleImpressionsClick(v, 'impressions')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value="1235"
              text="Total clicks & CTR"
              bgColor="chartColorTwo"
              onClick={(v: boolean) => handleImpressionsClick(v, 'clickAndCRT')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value="1235"
              text="Average CPM"
              bgColor="chartColorThree"
              onClick={(v: boolean) => handleImpressionsClick(v, 'averageCPM')}
              whiteFontColor
            />
          </Grid.Col>
          <Grid.Col span="content">
            <ChartControlBtn
              value="1235"
              text="Total spent"
              bgColor="chartColorFour"
              onClick={(v: boolean) => handleImpressionsClick(v, 'spent')}
            />
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col>
        <ParentSize>
          {() => (
            <TimeFrameChart
              width={1000}
              height={420}
              timeFrameData={timeFrames}
              metricsToShow={metricsToShow}
            />
          )}
        </ParentSize>
      </Grid.Col>
    </Grid>
  )
}

export default TimeFrame
