import {
  Title,
  Text,
  Flex,
  ActionIcon,
  Group,
  Indicator,
  Menu,
  rem,
  createStyles
} from '@mantine/core'
import { capitalizeFirstLetter, formatDate, maskAddress } from 'helpers/formatters'
import useAccount from 'hooks/useAccount'
import { useState } from 'react'
import BellIcon from 'resources/icons/Bell'
import DownArrowIcon from 'resources/icons/DownArrow'
import LogoutIcon from 'resources/icons/Logout'
import ValidatorsIcon from 'resources/icons/Validators'
import WithdrawIcon from 'resources/icons/Withdraw'
import Blockies from 'components/common/Blockies'
import { useLocation } from 'react-router-dom'

const useStyles = createStyles(() => ({
  rotateUpsideDown: {
    transform: 'rotate(180deg)'
  }
}))

function TopBar() {
  const { classes, cx } = useStyles()
  const { adexAccount } = useAccount()
  const location = useLocation()
  const splitPath = location.pathname.split('/')
  const title = splitPath[splitPath.length - 1]

  const [opened, setOpened] = useState<boolean>(false)
  const handleOpenClose = () => setOpened((prevState) => !prevState)

  return (
    <Flex direction="row" gap="md" justify="space-between" align="center" style={{ flexGrow: 1 }}>
      <Flex direction="column" justify="end" align="baseline">
        <Title order={5} weight="bold">
          {capitalizeFirstLetter(title)}
        </Title>
        <Text fz="xs">{formatDate(new Date())}</Text>
      </Flex>
      <Flex direction="row" justify="end" gap="md" align="center">
        <Group position="center">
          <Indicator>
            <ActionIcon>
              <BellIcon size={rem(24)} />
            </ActionIcon>
          </Indicator>
        </Group>
        <Menu onOpen={handleOpenClose} onClose={handleOpenClose}>
          <Menu.Target>
            <Flex direction="row" gap="md" align="center">
              <Blockies seedString={adexAccount?.address || ''} />
              <Flex direction="column">
                <Text inline weight="bold" size="xs">
                  John Doe
                </Text>
                <Text inline color="secondaryText" size="xs">
                  {maskAddress(adexAccount?.address || '')}
                </Text>
              </Flex>
              <DownArrowIcon
                size={rem(10)}
                className={cx({ [classes.rotateUpsideDown]: opened })}
              />
            </Flex>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item rightSection={<WithdrawIcon size={rem(14)} />}>Withdraw funds</Menu.Item>
            {/* TODO: Change the icon for Staking */}
            <Menu.Item rightSection={<WithdrawIcon size={rem(14)} />}>Staking</Menu.Item>
            <Menu.Item rightSection={<ValidatorsIcon size={rem(14)} />}>Validators</Menu.Item>
            <Menu.Item rightSection={<LogoutIcon size={rem(14)} />}>Log out</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default TopBar
