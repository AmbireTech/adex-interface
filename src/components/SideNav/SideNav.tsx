import {
  ScrollArea,
  Box,
  UnstyledButton,
  Text,
  useMantineTheme,
  rem,
  AppShell
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
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
import NavLink from './NavLink'
import Balance from './Balance'
import CreateCampaignBtn from './CreateCampaignBtn'

const useStyles = createStyles((theme) => ({
  logo: {
    display: 'block',
    width: rem(103),
    height: rem(40),
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md
  },
  balance: {
    borderBottom: `1px solid ${theme.colors.decorativeBorders[3]}`,
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm
  },
  newCampaign: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl
  }
}))

function SideNav() {
  const {
    isAdmin,
    adexAccount: { availableBalance }
  } = useAccount()
  const isManualDepositing = useMemo(() => IS_MANUAL_DEPOSITING === 'true', [])
  const location = useLocation()
  const match = useMatch(location.pathname)
  const year = useMemo(() => new Date().getFullYear(), [])
  const theme = useMantineTheme()
  const { classes } = useStyles()

  const hasAvailableBalance = useMemo(
    () => availableBalance && availableBalance > 0,
    [availableBalance]
  )

  return (
    <>
      <AppShell.Section>
        <UnstyledButton component={Link} to="" className={classes.logo}>
          <AdExLogo
            text={
              // TODO: fix it
              theme.colors.brandDarker[3]
              // theme.colorScheme === 'dark'
              //   ? theme.white
              //   : theme.colors.brandDarker[3]
            }
          />
        </UnstyledButton>
      </AppShell.Section>
      <AppShell.Section className={classes.balance}>
        <Balance />
      </AppShell.Section>
      <AppShell.Section className={classes.newCampaign}>
        <CreateCampaignBtn hasPopover={isManualDepositing && !hasAvailableBalance} />
      </AppShell.Section>
      <AppShell.Section mx="-xs" grow component={ScrollArea}>
        <Box>
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
            hasPopover={false}
          />
          <NavLink
            to="/dashboard/billing"
            icon={<BillingIcon />}
            label="Billing"
            active={useResolvedPath('billing').pathname === match?.pathname}
          />

          <NavLink
            to="https://help.adex.network/hc/en-us"
            target="_blank"
            icon={<HelpIcon />}
            label="Help Center"
          />
          {isAdmin && (
            <NavLink
              to="/dashboard/admin"
              // icon={<BillingIcon />}
              label="Admin Panel"
              active={useResolvedPath('admin').pathname === match?.pathname}
            />
          )}
        </Box>
      </AppShell.Section>
      <AppShell.Section mx="xs" mt="xl">
        <Text c="secondaryText" size="sm">
          ©{year} AdEx.
        </Text>
        <Text c="secondaryText" size="sm">
          All Rights Reserved.
        </Text>
        <Text c="secondaryText" size="sm">
          V.{appVersion}-beta
        </Text>
      </AppShell.Section>
    </>
  )
}

export default SideNav
