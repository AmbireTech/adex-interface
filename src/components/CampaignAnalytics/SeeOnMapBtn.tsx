import { UnstyledButton, Flex, Text } from '@mantine/core'
import MapIcon from 'resources/icons/Map'

type SeeOnMapBtnProps = {
  onBtnClicked: () => void
}

const SeeOnMapBtn = ({ onBtnClicked }: SeeOnMapBtnProps) => (
  <UnstyledButton onClick={onBtnClicked} mr="md">
    <Flex align="center">
      <Text size="sm" mr="sm">
        See on map
      </Text>
      <MapIcon size="24px" />
    </Flex>
  </UnstyledButton>
)

export default SeeOnMapBtn
