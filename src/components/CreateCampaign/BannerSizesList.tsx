import { Grid } from '@mantine/core'
import BannerSizeMock from 'components/common/BannerSizeMock'
import { TabSwitchDevices } from 'types'

const BannerSizesList = ({ selectedTab, imagesInfo }: TabSwitchDevices) => {
  return selectedTab === 'mobile' ? (
    <Grid>
      <Grid.Col span="content" offset={0.5}>
        <BannerSizeMock
          variant="mobileBanner"
          active={imagesInfo?.mobileBanner?.details?.checked}
        />
      </Grid.Col>
      <Grid.Col span="content" offset={0.5}>
        <BannerSizeMock
          variant="mobileLeaderboard"
          active={imagesInfo?.mobileLeaderboard?.details?.checked}
        />
      </Grid.Col>
    </Grid>
  ) : (
    <Grid grow>
      <Grid.Col span="content">
        <BannerSizeMock
          variant="mediumRectangle"
          active={imagesInfo?.mediumRectangle?.details?.checked}
        />
      </Grid.Col>
      <Grid.Col span="content">
        <BannerSizeMock variant="skyscraper" active={imagesInfo?.skyscraper?.details?.checked} />
      </Grid.Col>
      <Grid.Col span="content">
        <BannerSizeMock variant="leaderboard" active={imagesInfo?.leaderboard?.details?.checked} />
      </Grid.Col>
      <Grid.Col span="content">
        <BannerSizeMock variant="billboard" active={imagesInfo?.billboard?.details?.checked} />
      </Grid.Col>
      <Grid.Col span="content">
        <BannerSizeMock variant="halfPage" active={imagesInfo?.halfPage?.details?.checked} />
      </Grid.Col>
    </Grid>
  )
}

export default BannerSizesList
