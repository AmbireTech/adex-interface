import {
  ScrollArea,
  Stack,
  UnstyledButton,
  Text,
  AppShell,
  Center,
  Divider,
  Box
} from '@mantine/core'
import { useMatch, useLocation, useResolvedPath, Link } from 'react-router-dom'
import useAccount from 'hooks/useAccount'
import DashboardIcon from 'resources/icons/Dashboard'
import DepositIcon from 'resources/icons/Deposit'
import BillingIcon from 'resources/icons/Billing'
import HelpIcon from 'resources/icons/Help'
import AdExLogo from 'resources/logos/AdExLogo'
import { useMemo } from 'react'
import { appVersion } from 'helpers'
import { IS_MANUAL_DEPOSITING } from 'constants/balances'
import CustomAnchor from 'components/common/customAnchor'
import NavLink from './NavLink'
import Balance from './Balance'
import CreateCampaignBtn from './CreateCampaignBtn'

function SideNav() {
  const {
    isAdmin,
    adexAccount: { availableBalance }
  } = useAccount()
  const isManualDepositing = useMemo(() => IS_MANUAL_DEPOSITING === 'true', [])
  const location = useLocation()
  const match = useMatch(location.pathname)
  const year = useMemo(() => new Date().getFullYear(), [])

  const hasAvailableBalance = useMemo(
    () => availableBalance && availableBalance > 0,
    [availableBalance]
  )

  return (
    <>
      <AppShell.Section py="md">
        <UnstyledButton component={Link} to="">
          <Box c="brandDarker" w="110px">
            <AdExLogo />
          </Box>
        </UnstyledButton>
      </AppShell.Section>
      <AppShell.Section py="md">
        <Balance />
        <Divider mt="sm" />
      </AppShell.Section>
      <AppShell.Section py="md">
        <Center>
          <CreateCampaignBtn hasPopover={isManualDepositing && !hasAvailableBalance} />
        </Center>
      </AppShell.Section>
      <AppShell.Section mx="-xs" grow component={ScrollArea}>
        <Stack gap="xs" w="100%" justify="flex-start" pr="8" pl="0">
          <NavLink
            to="/dashboard"
            icon={<DashboardIcon />}
            label="Dashboard"
            active={useResolvedPath('').pathname === match?.pathname}
          />
          <NavLink
            to="/dashboard/deposit"
            icon={<DepositIcon />}
            label="Top Up Account"
            active={useResolvedPath('deposit').pathname === match?.pathname}
          />
          <NavLink
            to="/dashboard/billing"
            icon={<BillingIcon />}
            label="Billing"
            active={useResolvedPath('billing').pathname === match?.pathname}
          />

          <NavLink
            to="https://help.adex.network/hc/en-us"
            external
            icon={<HelpIcon />}
            label="Help Center"
          />
          {isAdmin && (
            <NavLink
              to="/dashboard/admin/campaigns"
              // icon={<BillingIcon />}
              label="Admin Panel"
              active={useResolvedPath('admin/campaigns').pathname === match?.pathname}
            />
          )}
        </Stack>
      </AppShell.Section>
      <AppShell.Section mx="xs" mt="xl">
        <Stack gap="xs" c="secondaryText">
          <CustomAnchor c="secondaryText" inline size="sm" external href="https://adex.network">
            ©{year} AdEx
          </CustomAnchor>
          <Text inline size="sm">
            All Rights Reserved
          </Text>
          <Text inline size="sm">
            V.{appVersion}-beta
          </Text>
        </Stack>
      </AppShell.Section>
    </>
  )
}

export default SideNav
