import {
  Title,
  Text,
  Flex,
  // ActionIcon,
  // Indicator,
  Group,
  Menu,
  rem,
  UnstyledButton,
  CopyButton,
  MantineTheme,
  getPrimaryShade
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { formatDate, maskAddress } from 'helpers/formatters'
import useAccount from 'hooks/useAccount'
import { useCallback, useMemo, useState } from 'react'
import DownArrowIcon from 'resources/icons/DownArrow'
import LogoutIcon from 'resources/icons/Logout'
// import BellIcon from 'resources/icons/Bell'
import Blockies from 'components/common/Blockies'
// import ValidatorsIcon from 'resources/icons/Validators'
// import WithdrawIcon from 'resources/icons/Withdraw'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import StakingIcon from 'resources/icons/Staking'
import { useAdExApi } from 'hooks/useAdexServices'
import useCustomNotifications from 'hooks/useCustomNotifications'
import CopyIcon from 'resources/icons/Copy'
import { useColorScheme } from '@mantine/hooks'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
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
        border: `1px solid ${theme.colors.decorativeBorders[primaryShade]}`,
        borderRadius: theme.radius.sm
      }
    },
    capitalizeText: {
      textTransform: 'capitalize'
    }
  }
})

const formatTitle = (str: string) => {
  if (!str) return ''

  return str.split('-').join(' ')
}

function TopBar() {
  const { classes, cx } = useStyles()
  const { adexAccount, disconnectWallet, resetAdexAccount } = useAccount()
  const { showNotification } = useCustomNotifications()
  const location = useLocation()
  const { id } = useParams()
  const splitPath = useMemo(() => location.pathname.split('/'), [location.pathname])
  const title = useMemo(
    () =>
      formatTitle(
        id && id === splitPath[splitPath.length - 1]
          ? splitPath[splitPath.length - 2]
          : splitPath[splitPath.length - 1]
      ),
    [splitPath, id]
  )

  const [opened, setOpened] = useState<boolean>(false)

  const { adexServicesRequest } = useAdExApi()
  const navigate = useNavigate()

  const handleLogutBtnClicked = useCallback(() => {
    if (!adexAccount.accessToken && !adexAccount.refreshToken) return

    adexServicesRequest('backend', {
      route: '/dsp/logout',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: {
        refreshToken: adexAccount.refreshToken
      }
    })
      .then((res) => {
        if (!res) throw new Error('Logout failed')
        if (Object.keys(res).length === 0 && res.constructor === Object) {
          disconnectWallet()
          resetAdexAccount()
          showNotification('info', 'Successfully logged out', 'Logging out')
          navigate('/login', { replace: true })
        }
      })
      .catch((e) => {
        console.error('Logging out failed', e)
        showNotification('error', e.message, 'Logging out failed')
      })
  }, [
    disconnectWallet,
    adexAccount.accessToken,
    adexAccount.refreshToken,
    adexServicesRequest,
    resetAdexAccount,
    showNotification,
    navigate
  ])

  return (
    <Flex
      direction="row"
      gap="md"
      justify="space-between"
      align="center"
      style={{ flexGrow: 1 }}
      wrap="nowrap"
    >
      <Flex direction="column" justify="end" align="baseline">
        <Title order={5} fw="bold" className={classes.capitalizeText}>
          {title}
        </Title>
        <Text fz="xs">{formatDate(new Date())}</Text>
      </Flex>
      <Flex direction="row" justify="end" gap="md" align="center">
        <Group justify="center">
          {/* <Indicator>
            <ActionIcon>
              <BellIcon size={rem(24)} />
            </ActionIcon>
          </Indicator> */}
          <CopyButton value={adexAccount.address}>
            {({ copied, copy }) => (
              <CopyIcon
                className={classes.menu}
                color={copied ? 'green' : undefined}
                size="24px"
                onClick={copy}
              />
            )}
          </CopyButton>
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
                <Blockies seedString={adexAccount.address} />
                <div>
                  {/* <Text fw="bold" size="xs">
                    John Doe
                  </Text> */}
                  <Text c="secondaryText" size="xs">
                    {maskAddress(adexAccount.address)}
                  </Text>
                </div>
                <DownArrowIcon
                  style={{ width: 10, height: 10 }}
                  size={rem(10)}
                  className={cx({ [classes.rotateUpsideDown]: opened })}
                />
              </Group>
            </UnstyledButton>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item rightSection={<WithdrawIcon className={classes.icon} />}>
              Withdraw funds
            </Menu.Item> */}
            <Menu.Item
              component="a"
              href="https://staking.adex.network/#/"
              target="_blank"
              rightSection={<StakingIcon className={classes.icon} />}
            >
              Staking
            </Menu.Item>
            {/* <Menu.Item rightSection={<ValidatorsIcon className={classes.icon} />}>
              Validators
            </Menu.Item> */}
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
