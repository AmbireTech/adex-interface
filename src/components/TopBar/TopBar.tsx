import { Title, Text, Header, Flex, ActionIcon, Group, Indicator } from '@mantine/core'
import BellIcon from 'resources/icons/Bell'

function TopBar() {
  return (
    <Header
      height={90}
      p="sm"
      style={{
        display: 'flex',
        flexDirection: 'row'
      }}
    >
      <Flex
        direction="row"
        gap="md"
        justify="space-between"
        align="flex-end"
        style={{ flexGrow: 1 }}
      >
        <Flex direction="column" justify="end" align="baseline">
          <Title order={2}>Welcome</Title>
          <Text fz="xs">{new Date().toLocaleDateString()}</Text>
        </Flex>
        <Flex direction="row" justify="end" align="baseline">
          <Group position="center">
            <Indicator>
              <ActionIcon>
                <BellIcon />
              </ActionIcon>
            </Indicator>
          </Group>
        </Flex>
      </Flex>
    </Header>
  )
}

export default TopBar