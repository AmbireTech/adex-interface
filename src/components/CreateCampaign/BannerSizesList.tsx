import { Flex } from '@mantine/core'
import BannerSizeMock from 'components/common/BannerSizeMock'
import { ITabSwitchDevices } from 'types'

const BannerSizesList = ({ selectedTab }: ITabSwitchDevices) => {
  return selectedTab === 'mobile' ? (
    <Flex gap={40}>
      <BannerSizeMock variant="mobileBanner" />
      <BannerSizeMock variant="mobileLeaderboard" />
    </Flex>
  ) : (
    <Flex gap={40}>
      <BannerSizeMock variant="mediumRectangle" />
      <BannerSizeMock variant="skyscraper" />
      <BannerSizeMock variant="leaderboard" />
      <BannerSizeMock variant="billboard" />
      <BannerSizeMock variant="halfPage" />
    </Flex>
  )
}

export default BannerSizesList
