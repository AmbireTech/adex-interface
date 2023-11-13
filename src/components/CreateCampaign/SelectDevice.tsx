import { Flex, Text } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'

const SelectDevice = () => {
  const {
    campaign: { device },
    updateCampaign
  } = useCreateCampaignContext()

  return (
    <>
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        1. Select device
      </Text>

      <Flex gap={20}>
        <CustomCard
          width={164}
          height={164}
          icon={<MobileIcon size="60px" />}
          text="Mobile"
          color="brand"
          active={device === 'mobile'}
          action={() => device !== 'mobile' && updateCampaign('device', 'mobile')}
        />
        <CustomCard
          width={164}
          height={164}
          icon={<DesktopIcon size="60px" />}
          text="Desktop"
          color="brand"
          active={device === 'desktop'}
          action={() => device !== 'desktop' && updateCampaign('device', 'desktop')}
        />
      </Flex>
    </>
  )
}

export default SelectDevice
