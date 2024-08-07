import {
  Group,
  Modal,
  Text,
  Grid,
  Flex,
  Button,
  UnstyledButton,
  Stack,
  MantineTheme,
  getPrimaryShade
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { DatePicker } from '@mantine/dates'
import { useColorScheme } from '@mantine/hooks'
import { formatDateShort } from 'helpers/formatters'
import { useCallback, useMemo, useState } from 'react'
import CalendarIcon from 'resources/icons/Calendar'
import DownArrowIcon from 'resources/icons/DownArrow'
import TimeIcon from 'resources/icons/Time'
import dayjs from 'dayjs'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { initAllLocales } from 'helpers/createCampaignHelpers'
import Clock from './Clock'
import CampaignTimePicker from './CampaignTimePicker'

type DateOrTime = 'date' | 'time'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    wrapper: {
      cursor: 'pointer',
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade]
    },
    selected: {
      borderColor: theme.colors.brand[primaryShade],
      color: theme.colors.brand[primaryShade],
      backgroundColor: theme.colors.lightBackground[primaryShade]
    },
    footer: {
      backgroundColor: theme.colors.lightBackground[primaryShade],
      padding: theme.spacing.lg
    },
    month: {
      background: theme.colors.lightBackground[primaryShade],
      borderRadius: theme.radius.md
    }
  }
})

const CampaignPeriodModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const allLocales = useMemo(() => initAllLocales(), [])
  const {
    updateCampaign,
    campaign: { startsAt, endsAt }
  } = useCreateCampaignContext()

  const { classes, cx } = useStyles()
  const [[startDate, endDate], setStartEndDates] = useState<[Date | null, Date | null]>([
    startsAt ? new Date(startsAt) : null,
    endsAt ? new Date(endsAt) : null
  ])

  const [[startTime, endTime], setStartEndTimes] = useState<[string | null, string | null]>([
    (startsAt && dayjs(startsAt).format('HH:mm')) || null,
    (endsAt && dayjs(endsAt).format('HH:mm')) || null
  ])
  const locale = useMemo(() => navigator && navigator.language.split('-')[0], [])
  const [selectDateOrTimeTab, setSelectDateOrTimeTab] = useState<DateOrTime>('date')
  const isDateTabSelected = useMemo(() => selectDateOrTimeTab === 'date', [selectDateOrTimeTab])
  const dateNow = useMemo(() => new Date(), [])
  const currentDate = useMemo(() => formatDateShort(dateNow), [dateNow])
  const mergedStartDateTime = useMemo(
    () =>
      startDate && startTime
        ? dayjs(startDate)
            .hour(parseInt(startTime.split(':')[0], 10))
            .minute(parseInt(startTime.split(':')[1], 10))
        : null,
    [startDate, startTime]
  )

  const mergedEndDateTime = useMemo(
    () =>
      endDate && endTime
        ? dayjs(endDate)
            .hour(parseInt(endTime.split(':')[0], 10))
            .minute(parseInt(endTime.split(':')[1], 10))
        : null,
    [endDate, endTime]
  )

  const startDateFormatted = useMemo(
    () => (startDate ? formatDateShort(startDate) : currentDate),
    [startDate, currentDate]
  )
  const endDateFormatted = useMemo(
    () => (endDate ? formatDateShort(endDate) : currentDate),
    [endDate, currentDate]
  )

  const setStartTime = useCallback(
    (value: string) => {
      setStartEndTimes([value, endTime])
    },
    [endTime]
  )
  const setEndTime = useCallback(
    (value: string) => setStartEndTimes([startTime, value]),
    [startTime]
  )
  const handleSelectDateOrTimeTabClicked = useCallback(
    (tabValue: DateOrTime) => setSelectDateOrTimeTab(tabValue),
    []
  )

  const handleApplyBtnClicked = useCallback(() => {
    if (mergedEndDateTime && mergedStartDateTime) {
      updateCampaign('startsAt', mergedStartDateTime.toDate())
      updateCampaign('endsAt', mergedEndDateTime.toDate())
      close()
    }
  }, [updateCampaign, mergedEndDateTime, mergedStartDateTime, close])

  return (
    <Modal centered size={736} opened={opened} withCloseButton={false} onClose={close}>
      <Grid grow m={0}>
        <Grid.Col p={0}>
          <Grid>
            <Grid.Col
              p={0}
              span={6}
              className={cx(classes.wrapper, { [classes.selected]: isDateTabSelected })}
              onClick={() => handleSelectDateOrTimeTabClicked('date')}
            >
              <Flex justify="space-between" align="center" p="xs">
                <Group>
                  <CalendarIcon />
                  <div>
                    <Text fw="bold" size="xl">
                      Set Period
                    </Text>
                    <Text c="secondaryText" size="xs">
                      Current date: {currentDate}
                    </Text>
                  </div>
                </Group>
                <DownArrowIcon size="10px" style={{ transform: 'rotate(-90deg)' }} />
              </Flex>
            </Grid.Col>
            <Grid.Col
              p={0}
              span={6}
              className={cx(classes.wrapper, { [classes.selected]: !isDateTabSelected })}
              onClick={() => handleSelectDateOrTimeTabClicked('time')}
            >
              <Flex justify="space-between" align="center" p="xs">
                <Group>
                  <TimeIcon />
                  <div>
                    <Text fw="bold" size="xl">
                      Set Time
                    </Text>
                    <Text c="secondaryText" size="xs">
                      Current time: <Clock />
                    </Text>
                  </div>
                </Group>
                <DownArrowIcon size="10px" style={{ transform: 'rotate(-90deg)' }} />
              </Flex>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col pt="lg" pb="lg">
          {selectDateOrTimeTab === 'date' ? (
            <Flex justify="center">
              <DatePicker
                size="lg"
                type="range"
                locale={allLocales[locale]}
                numberOfColumns={2}
                value={[startDate, endDate]}
                onChange={setStartEndDates}
                minDate={dateNow}
                classNames={{ month: classes.month }}
              />
            </Flex>
          ) : (
            <Grid grow>
              <Grid.Col span={6}>
                <Stack align="center">
                  <Text c="secondaryText" size="md" p="xs">
                    Start time
                  </Text>
                  <CampaignTimePicker
                    defaultValue={dayjs(startsAt).format('HH:mm')}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </Stack>
              </Grid.Col>
              <Grid.Col span={6}>
                <Stack align="center">
                  <Text c="secondaryText" size="md" p="xs">
                    End time
                  </Text>
                  <CampaignTimePicker
                    defaultValue={dayjs(endsAt).format('HH:mm')}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </Stack>
              </Grid.Col>
            </Grid>
          )}
        </Grid.Col>
        <Grid.Col p={0}>
          <Flex
            wrap="wrap"
            direction="row"
            justify="space-around"
            align="center"
            className={classes.footer}
          >
            <Flex direction="column">
              <Text c="secondaryText" size="xs">
                Start Date
              </Text>
              <Text size="md">
                {startDateFormatted} {startTime}
              </Text>
            </Flex>
            <Flex direction="column">
              <Text c="secondaryText" size="xs">
                End Date
              </Text>
              <Text size="md">
                {endDateFormatted} {endTime}
              </Text>
            </Flex>
            <Button
              disabled={!(mergedEndDateTime && mergedStartDateTime)}
              variant="filled"
              size="lg"
              onClick={handleApplyBtnClicked}
            >
              Apply
            </Button>
            <UnstyledButton onClick={() => close()}>Cancel</UnstyledButton>
          </Flex>
        </Grid.Col>
      </Grid>
    </Modal>
  )
}

export default CampaignPeriodModal
