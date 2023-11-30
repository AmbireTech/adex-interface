import { Grid } from '@mantine/core'
import BannerSizeMock from 'components/common/BannerSizeMock'
import { checkSelectedDevices } from 'helpers/createCampaignHelpers'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import { TabSwitchDevices } from 'types'

const BannerSizesList = ({ imagesInfo }: TabSwitchDevices) => {
  const {
    campaign: { devices }
  } = useCreateCampaignContext()

  const selectedDevices = useMemo(() => checkSelectedDevices(devices), [devices])

  return selectedDevices === 'mobile' ? (
    <Grid>
      <Grid.Col span="content">
        <BannerSizeMock
          variant="mediumRectangle"
          active={imagesInfo?.mediumRectangle?.details?.checked}
        />
      </Grid.Col>
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
  ) : selectedDevices === 'desktop' ? (
    <Grid>
      <Grid.Col span="content">
        <BannerSizeMock
          variant="mediumRectangle"
          active={imagesInfo?.mediumRectangle?.details?.checked}
        />
      </Grid.Col>
      <Grid.Col span="content" offset={0.5}>
        <BannerSizeMock variant="skyscraper" active={imagesInfo?.skyscraper?.details?.checked} />
      </Grid.Col>
      <Grid.Col span="content" offset={0.5}>
        <BannerSizeMock variant="leaderboard" active={imagesInfo?.leaderboard?.details?.checked} />
      </Grid.Col>
      <Grid.Col span="content" offset={0.5}>
        <BannerSizeMock variant="billboard" active={imagesInfo?.billboard?.details?.checked} />
      </Grid.Col>
      <Grid.Col span="content" offset={0.5}>
        <BannerSizeMock variant="halfPage" active={imagesInfo?.halfPage?.details?.checked} />
      </Grid.Col>
    </Grid>
  ) : selectedDevices === 'both' ? (
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
      <Grid.Col span="content">
        <BannerSizeMock
          variant="mobileLeaderboard"
          active={imagesInfo?.mobileLeaderboard?.details?.checked}
        />
      </Grid.Col>
      <Grid.Col span="content">
        <BannerSizeMock
          variant="mobileBanner"
          active={imagesInfo?.mobileBanner?.details?.checked}
        />
      </Grid.Col>
    </Grid>
  ) : null
}

export default BannerSizesList
