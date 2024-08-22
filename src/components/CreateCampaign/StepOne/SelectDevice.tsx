import { Flex, Text } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'
import { Devices } from 'types'

const SelectDevice = () => {
  const {
    campaign: { devices },
    form
  } = useCreateCampaignContext()

  const toggleDeviceSelection = (device: Devices) => {
    const index = devices.indexOf(device)

    if (index > -1) {
      form.removeListItem('devices', devices.indexOf(device))
    } else {
      form.insertListItem('devices', device)
    }
  }

  return (
    <>
      <Text c="secondaryText" size="sm" fw="bold" mb="xs">
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
