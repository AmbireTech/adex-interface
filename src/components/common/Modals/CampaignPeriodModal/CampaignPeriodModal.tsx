import {
  Group,
  Modal,
  Text,
  rem,
  Grid,
  createStyles,
  Flex,
  Button,
  UnstyledButton,
  Stack
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { formatDateShort } from 'helpers/formatters'
import { useCallback, useMemo, useState } from 'react'
import CalendarIcon from 'resources/icons/Calendar'
import DownArrowIcon from 'resources/icons/DownArrow'
import TimeIcon from 'resources/icons/Time'
import dayjs from 'dayjs'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import Clock from './Clock'
import CampaignTimePicker from './CampaignTimePicker'

type DateOrTime = 'date' | 'time'

const useStyles = createStyles((theme) => ({
  wrapper: {
    cursor: 'pointer',
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()]
  },
  selected: {
    borderColor: theme.colors.brand[theme.fn.primaryShade()],
    color: theme.colors.brand[theme.fn.primaryShade()],
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()]
  },
  footer: {
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    padding: theme.spacing.lg
  },
  month: {
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    borderRadius: theme.radius.md
  }
}))

const CampaignPeriodModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  // TODO: add it like helper func
  const locales = (require as any).context('dayjs/locale', true, /\.js$/)

  const allLocales: Record<string, any> = locales.keys().reduce((acc: any, fileName: any) => {
    const localeName = fileName.replace(/^.\/(.*).js$/, '$1')
    const localeModule = locales(fileName)
    acc[localeName] = localeModule.default || localeModule
    return acc
  }, {})
  // =================
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
      updateCampaign('startsAt', mergedStartDateTime)
      updateCampaign('endsAt', mergedEndDateTime)
      close()
    }
  }, [updateCampaign, mergedEndDateTime, mergedStartDateTime, close])

  return (
    <Modal centered size={736} padding={0} opened={opened} withCloseButton={false} onClose={close}>
      <Grid grow m={0}>
        <Grid.Col p={0}>
          <Grid>
            <Grid.Col
              span={6}
              className={cx(classes.wrapper, { [classes.selected]: isDateTabSelected })}
              onClick={() => handleSelectDateOrTimeTabClicked('date')}
            >
              <Group position="apart" align="center" pl="xs" pt="xs">
                <Group>
                  <CalendarIcon />
                  <div>
                    <Text weight="bold" size="xl">
                      Set Period
                    </Text>
                    <Text color="secondaryText" size="xs">
                      Current date: {currentDate}
                    </Text>
                  </div>
                </Group>
                <DownArrowIcon size={rem(10)} style={{ transform: 'rotate(-90deg)' }} />
              </Group>
            </Grid.Col>
            <Grid.Col
              span={6}
              className={cx(classes.wrapper, { [classes.selected]: !isDateTabSelected })}
              onClick={() => handleSelectDateOrTimeTabClicked('time')}
            >
              <Group position="apart" align="center" pr="xs" pt="xs">
                <Group>
                  <TimeIcon />
                  <div>
                    <Text weight="bold" size="xl">
                      Set Time
                    </Text>
                    <Text color="secondaryText" size="xs">
                      Current time: <Clock />
                    </Text>
                  </div>
                </Group>
                <DownArrowIcon size={rem(10)} style={{ transform: 'rotate(-90deg)' }} />
              </Group>
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
                  <Text color="secondaryText" size="md" p="xs">
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
                  <Text color="secondaryText" size="md" p="xs">
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
              <Text color="secondaryText" size="xs">
                Start Date
              </Text>
              <Text size="md">
                {startDateFormatted} {startTime}
              </Text>
            </Flex>
            <Flex direction="column">
              <Text color="secondaryText" size="xs">
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
