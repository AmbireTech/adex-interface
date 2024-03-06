import {
  Title,
  Text,
  Flex,
  ActionIcon,
  Group,
  Indicator,
  Menu,
  rem,
  createStyles,
  UnstyledButton
} from '@mantine/core'
import { capitalizeFirstLetter, formatDate, maskAddress } from 'helpers/formatters'
import useAccount from 'hooks/useAccount'
import { useCallback, useMemo, useState } from 'react'
import BellIcon from 'resources/icons/Bell'
import DownArrowIcon from 'resources/icons/DownArrow'
import LogoutIcon from 'resources/icons/Logout'
import ValidatorsIcon from 'resources/icons/Validators'
import WithdrawIcon from 'resources/icons/Withdraw'
import Blockies from 'components/common/Blockies'
import { useLocation } from 'react-router-dom'
import StakingIcon from 'resources/icons/Staking'
import useFetch from 'hooks/useFetchRequest'

const useStyles = createStyles((theme) => ({
  rotateUpsideDown: {
    transform: 'scale(-1)'
  },
  menu: {
    cursor: 'pointer'
  },
  icon: {
    width: rem(14),
    height: rem(14)
  },
  item: {
    '&:hover': {
      border: `1px solid ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`,
      borderRadius: theme.radius.sm
    }
  }
}))

function TopBar() {
  const { classes, cx } = useStyles()
  const { adexAccount, disconnectWallet, setAdexAccount, updateAuthMsgResp } = useAccount()
  const location = useLocation()
  const splitPath = useMemo(() => location.pathname.split('/'), [location.pathname])
  const title = useMemo(
    () => (splitPath[splitPath.length - 1] === '' ? 'dashboard' : splitPath[1]),
    [splitPath]
  )

  const [opened, setOpened] = useState<boolean>(false)

  const { fetchAuthRequest } = useFetch()

  const handleLogutBtnClicked = useCallback(() => {
    if (!adexAccount?.accessToken && !adexAccount?.refreshToken) return
    // TODO: remove all req variables
    const BASE_URL = 'http://localhost:3069'
    const url = `${BASE_URL}/dsp/logout`
    const method = 'POST'
    const headers = {
      'Content-Type': 'application/json',
      'X-DSP-AUTH': `Bearer ${adexAccount.accessToken}`
    }
    const body = {
      refreshToken: adexAccount.refreshToken
    }

    const req = {
      url,
      method,
      headers,
      body
    }

    fetchAuthRequest(req).then((res) => {
      if (res) {
        disconnectWallet()
        setAdexAccount(null)
        updateAuthMsgResp(null)
      }
    })
  }, [
    disconnectWallet,
    fetchAuthRequest,
    adexAccount?.accessToken,
    adexAccount?.refreshToken,
    setAdexAccount,
    updateAuthMsgResp
  ])

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

        <Menu
          opened={opened}
          onChange={setOpened}
          width={rem(200)}
          classNames={{ item: classes.item }}
        >
          <Menu.Target>
            <UnstyledButton>
              <Group>
                <Blockies seedString={adexAccount?.address || ''} />
                <div>
                  <Text weight="bold" size="xs">
                    John Doe
                  </Text>
                  <Text color="secondaryText" size="xs">
                    {maskAddress(adexAccount?.address || '')}
                  </Text>
                </div>
                <DownArrowIcon
                  size={rem(10)}
                  className={cx({ [classes.rotateUpsideDown]: opened })}
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item rightSection={<WithdrawIcon className={classes.icon} />}>
              Withdraw funds
            </Menu.Item>
            <Menu.Item rightSection={<StakingIcon className={classes.icon} />}>Staking</Menu.Item>
            <Menu.Item rightSection={<ValidatorsIcon className={classes.icon} />}>
              Validators
            </Menu.Item>
            <Menu.Item
              onClick={handleLogutBtnClicked}
              rightSection={<LogoutIcon className={classes.icon} />}
            >
              Log out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Flex>
    </Flex>
  )
}

export default TopBar
