import { Flex, Text } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'
import { Devices } from 'types'

const SelectDevice = () => {
  const {
    campaign: { devices },
    updateCampaign
  } = useCreateCampaignContext()

  const toggleDeviceSelection = (device: Devices) => {
    const isSelected = devices.includes(device)
    const updatedDevices = isSelected
      ? devices.filter((selectedDevice) => selectedDevice !== device)
      : [...devices, device]

    updateCampaign('devices', updatedDevices)
  }

  return (
    <>
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        2. Select device
      </Text>
      <Flex gap={20} justify="space-between">
        <CustomCard
          width="48%"
          height={100}
          text="Mobile"
          iconLeft={<MobileIcon size="24px" />}
          color="brand"
          active={devices.includes('mobile')}
          action={() => toggleDeviceSelection('mobile')}
          variant="shadow"
          hasCheckMark
        />
        <CustomCard
          width="48%"
          height={100}
          iconLeft={<DesktopIcon size="24px" />}
          text="Desktop"
          color="brand"
          active={devices.includes('desktop')}
          action={() => toggleDeviceSelection('desktop')}
          variant="shadow"
          hasCheckMark
        />
      </Flex>
    </>
  )
}

export default SelectDevice
