import { Group, Stack, Text } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'
import { Devices } from 'types'
import InfoAlertMessage from 'components/common/InfoAlertMessage'

const SelectDevice = () => {
  const {
    campaign: { devices },
    form: { removeListItem, insertListItem, validateField, errors }
  } = useCreateCampaignContext()

  const toggleDeviceSelection = (device: Devices) => {
    const index = devices.indexOf(device)

    if (index > -1) {
      removeListItem('devices', devices.indexOf(device))
    } else {
      insertListItem('devices', device)
    }

    // TODO: add context fn or use it as custom validation on change
    // NOTE: in order validateField to work with specific field, the field has to be form in validate props
    validateField('devices')
  }

  return (
    <Stack gap="xs">
      <Text c="secondaryText" size="sm" fw="bold">
        2. Select device
      </Text>
      <Group justify="space-between">
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
      </Group>
      {errors.devices && <InfoAlertMessage message={errors.devices} />}
    </Stack>
  )
}

export default SelectDevice
