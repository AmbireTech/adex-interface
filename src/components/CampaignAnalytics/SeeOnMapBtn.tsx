import { UnstyledButton, Flex, Text } from '@mantine/core'
import DownloadIcon from 'resources/icons/Download'

type SeeOnMapBtnProps = {
  onBtnClicked: () => void
}

const SeeOnMapBtn = ({ onBtnClicked }: SeeOnMapBtnProps) => (
  <UnstyledButton onClick={onBtnClicked} mr="md">
    <Flex align="center">
      <Text size="sm" mr="sm">
        See on map
      </Text>
      {/* TODO: change with map icon, when the icon is added to the design */}
      <DownloadIcon size="24px" />
    </Flex>
  </UnstyledButton>
)

export default SeeOnMapBtn
