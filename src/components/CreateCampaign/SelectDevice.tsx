import { Flex } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import DesktopIcon from 'resources/icons/Desktop'
import MobileIcon from 'resources/icons/Mobile'
import { SelectDeviceProps } from 'types'

const SelectDevice = ({ selectedTab, selectTab }: SelectDeviceProps) => {
  return (
    <Flex gap={20}>
      <CustomCard
        width={164}
        height={164}
        icon={<MobileIcon size="60px" />}
        text="Mobile"
        color="brand"
        active={selectedTab === 'mobile'}
        action={() => selectTab('mobile')}
      />
      <CustomCard
        width={164}
        height={164}
        icon={<DesktopIcon size="60px" />}
        text="Desktop"
        color="brand"
        active={selectedTab === 'desktop'}
        action={() => selectTab('desktop')}
      />
    </Flex>
  )
}

export default SelectDevice
