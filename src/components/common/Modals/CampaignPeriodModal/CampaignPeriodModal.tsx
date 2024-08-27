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
    form: { setFieldValue },
    campaign: { startsAt, endsAt }
  } = useCreateCampaignContext()

  const { classes, cx } = useStyles()
  const [[startDate, endDate], setStartEndDates] = useState<[Date | null, Date | null]>([
    new Date(startsAt),
    new Date(endsAt)
  ])

  const [[startTime, endTime], setStartEndTimes] = useState<[string, string]>([
    dayjs(startsAt).format('HH:mm'),
    dayjs(endsAt).format('HH:mm')
  ])
  const [selectDateOrTimeTab, setSelectDateOrTimeTab] = useState<DateOrTime>('date')
  const locale = useMemo(() => navigator && navigator.language.split('-')[0], [])

  const dateNow = useMemo(() => new Date(), [])

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

  const handleApplyBtnClicked = useCallback(() => {
    setFieldValue(
      'startsAt',
      dayjs(startDate)
        .hour(parseInt(startTime.split(':')[0], 10))
        .minute(parseInt(startTime.split(':')[1], 10))
        .toDate()
    )
    setFieldValue(
      'endsAt',
      dayjs(endDate)
        .hour(parseInt(endTime.split(':')[0], 10))
        .minute(parseInt(endTime.split(':')[1], 10))
        .toDate()
    )
    close()
  }, [setFieldValue, startDate, startTime, endDate, endTime, close])

  return (
    <Modal
      centered
      size={736}
      opened={opened}
      withCloseButton={false}
      onClose={close}
      styles={{ body: { padding: 0 } }}
    >
      <Stack>
        <Grid>
          <Grid.Col
            span={6}
            className={cx(classes.wrapper, { [classes.selected]: selectDateOrTimeTab === 'date' })}
            onClick={() => setSelectDateOrTimeTab('date')}
          >
            <Flex justify="space-between" align="center" p="xs">
              <Group>
                <CalendarIcon />
                <div>
                  <Text fw="bold" size="xl">
                    Set Period
                  </Text>
                  <Text c="secondaryText" size="xs">
                    Current date: {formatDateShort(dateNow)}
                  </Text>
                </div>
              </Group>
              <DownArrowIcon size="10px" style={{ transform: 'rotate(-90deg)' }} />
            </Flex>
          </Grid.Col>
          <Grid.Col
            span={6}
            className={cx(classes.wrapper, { [classes.selected]: selectDateOrTimeTab === 'time' })}
            onClick={() => setSelectDateOrTimeTab('time')}
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
          <Grid grow p="lg">
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
              {formatDateShort(startDate || dateNow)} {startTime}
            </Text>
          </Flex>
          <Flex direction="column">
            <Text c="secondaryText" size="xs">
              End Date
            </Text>
            <Text size="md">
              {formatDateShort(endDate || dateNow)} {endTime}
            </Text>
          </Flex>
          <Button variant="filled" size="lg" onClick={handleApplyBtnClicked}>
            Apply
          </Button>
          <UnstyledButton onClick={() => close()}>Cancel</UnstyledButton>
        </Flex>
      </Stack>
    </Modal>
  )
}

export default CampaignPeriodModal
