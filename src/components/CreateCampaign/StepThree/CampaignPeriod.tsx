import { ActionIcon, Flex, MantineTheme, Text, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useDisclosure, useColorScheme } from '@mantine/hooks'
import { CampaignPeriodModal } from 'components/common/Modals'
import { formatDateTime } from 'helpers/formatters'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import CalendarIcon from 'resources/icons/Calendar'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)
  return {
    wrapper: {
      backgroundColor: theme.colors.lightBackground[primaryShade],
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade],
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm
    }
  }
})

const CampaignPeriod = () => {
  const {
    campaign: { startsAt, endsAt }
  } = useCreateCampaignContext()

  const startDateTime = useMemo(() => startsAt && formatDateTime(startsAt), [startsAt])
  const endDateTime = useMemo(() => endsAt && formatDateTime(endsAt), [endsAt])
  const { classes } = useStyles()

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <Flex
      wrap="wrap"
      direction="row"
      justify="space-between"
      maw={{ sm: '100%', lg: '50%' }}
      align="center"
      className={classes.wrapper}
    >
      <Flex direction="column">
        <Text c="secondaryText" size="xs">
          Start Date
        </Text>
        <Text size="md">{startDateTime}</Text>
      </Flex>
      <Flex direction="column">
        <Text c="secondaryText" size="xs">
          End Date
        </Text>
        <Text size="md">{endDateTime}</Text>
      </Flex>
      {/* TODO: Fix the ActionIcon */}
      <ActionIcon color="none" size={24} onClick={() => open()}>
        <CalendarIcon color="mainText" />
      </ActionIcon>
      <CampaignPeriodModal opened={opened} close={close} />
    </Flex>
  )
}

export default CampaignPeriod
