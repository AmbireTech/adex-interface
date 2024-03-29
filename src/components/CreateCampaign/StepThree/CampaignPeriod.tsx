import { ActionIcon, Flex, MediaQuery, Text, createStyles } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { CampaignPeriodModal } from 'components/common/Modals'
import { formatDateTime } from 'helpers/formatters'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useMemo } from 'react'
import CalendarIcon from 'resources/icons/Calendar'

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    borderRadius: theme.radius.md,
    padding: theme.spacing.sm
  }
}))

const CampaignPeriod = () => {
  const {
    campaign: { startsAt, endsAt }
  } = useCreateCampaignContext()

  const startDateTime = useMemo(() => startsAt && formatDateTime(startsAt), [startsAt])
  const endDateTime = useMemo(() => endsAt && formatDateTime(endsAt), [endsAt])
  const { classes } = useStyles()

  const [opened, { open, close }] = useDisclosure(false)

  return (
    <MediaQuery
      smallerThan="lg"
      styles={{
        maxWidth: '100%'
      }}
    >
      <Flex
        wrap="wrap"
        direction="row"
        justify="space-between"
        maw="50%"
        align="center"
        className={classes.wrapper}
      >
        <Flex direction="column">
          <Text color="secondaryText" size="xs">
            Start Date
          </Text>
          <Text size="md">{startDateTime}</Text>
        </Flex>
        <Flex direction="column">
          <Text color="secondaryText" size="xs">
            End Date
          </Text>
          <Text size="md">{endDateTime}</Text>
        </Flex>
        <ActionIcon size={24} onClick={() => open()}>
          <CalendarIcon color="mainText" />
        </ActionIcon>
        <CampaignPeriodModal opened={opened} close={close} />
      </Flex>
    </MediaQuery>
  )
}

export default CampaignPeriod
