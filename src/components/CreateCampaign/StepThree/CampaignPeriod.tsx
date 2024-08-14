import { ActionIcon, Flex, MantineTheme, Text, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useDisclosure, useColorScheme } from '@mantine/hooks'
import { CampaignPeriodModal } from 'components/common/Modals'
import { formatDateTime } from 'helpers/formatters'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import CalendarIcon from 'resources/icons/Calendar'

const useStyles = createStyles((theme: MantineTheme, { hasErrors }: { hasErrors: boolean }) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)
  return {
    wrapper: {
      backgroundColor: theme.colors.lightBackground[primaryShade],
      border: '1px solid',
      borderColor: hasErrors
        ? theme.colors.error[primaryShade]
        : theme.colors.decorativeBorders[primaryShade],
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm
    }
  }
})

const CampaignPeriod = () => {
  const {
    campaign: { startsAt, endsAt },
    form: {
      errors: { startsAt: errorStartsAt, endsAt: errorEndsAt }
    }
  } = useCreateCampaignContext()

  const startDateTime = useMemo(() => startsAt && formatDateTime(startsAt), [startsAt])
  const endDateTime = useMemo(() => endsAt && formatDateTime(endsAt), [endsAt])
  const { classes } = useStyles({ hasErrors: !!errorStartsAt || !!errorEndsAt })

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <>
      <Flex
        wrap="wrap"
        direction="row"
        justify="space-between"
        maw={{ sm: '100%', lg: '50%' }}
        align="center"
        className={classes.wrapper}
      >
        <Flex direction="column" c={errorStartsAt ? 'error' : undefined}>
          <Text c="secondaryText" size="xs">
            Start Date
          </Text>
          <Text size="md">{startDateTime}</Text>
        </Flex>
        <Flex direction="column" c={errorEndsAt ? 'error' : undefined}>
          <Text c="secondaryText" size="xs">
            End Date
          </Text>
          <Text size="md">{endDateTime}</Text>
        </Flex>
        <ActionIcon variant="transparent" size="lg" onClick={open}>
          <CalendarIcon size="24px" color="mainText" />
        </ActionIcon>
        <CampaignPeriodModal opened={opened} close={close} />
      </Flex>
      {errorStartsAt && (
        <Text size="sm" c="error">
          {errorStartsAt}
        </Text>
      )}
      {errorEndsAt && (
        <Text size="sm" c="error">
          {errorEndsAt}
        </Text>
      )}
    </>
  )
}

export default CampaignPeriod
