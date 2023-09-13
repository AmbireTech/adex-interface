import { Grid } from '@mantine/core'
import { ParentSize } from '@visx/responsive'
import TimeFrameChart from 'components/common/Chart/TimeFrameChart'
import { ITimeFrameData } from 'types'

const TimeFrame = ({ timeFrames }: { timeFrames: ITimeFrameData[] | undefined }) => {
  if (!timeFrames?.length) {
    return <div>No time frames found</div>
  }
  console.log('timeFrameData', timeFrames)
  //   const elements = timeFrames?.map((item) => ({
  //     ...item,
  //     impressions: item.impressions.toLocaleString(),
  //     clicks: item.clicks.toLocaleString(),
  //     ctrPercents: `${item.ctrPercents} %`
  //   }))
  return (
    <Grid grow>
      <Grid.Col h={200}>
        <h1>Controls here</h1>
      </Grid.Col>
      <Grid.Col>
        <ParentSize>
          {() => <TimeFrameChart width={1000} height={420} timeFrameData={timeFrames} />}
        </ParentSize>
      </Grid.Col>
    </Grid>
  )
}

export default TimeFrame
