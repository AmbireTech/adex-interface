import { Grid } from '@mantine/core'
import { ParentSize } from '@visx/responsive'
import Example from 'components/common/Chart/Example'

const TimeFrame = ({ timeFrames }: { timeFrames: any[] | undefined }) => {
  if (!timeFrames?.length) {
    return <div>No placement found</div>
  }

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
        <ParentSize>{() => <Example width={1000} height={420} />}</ParentSize>
      </Grid.Col>
    </Grid>
  )
}

export default TimeFrame
