import {
  Group,
  Modal,
  Text,
  rem,
  Grid,
  createStyles,
  Flex,
  Button,
  UnstyledButton
} from '@mantine/core'
import { DatePicker } from '@mantine/dates'
import { formatDateShort } from 'helpers/formatters'
import { useCallback, useMemo, useState } from 'react'
import CalendarIcon from 'resources/icons/Calendar'
import DownArrowIcon from 'resources/icons/DownArrow'
import TimeIcon from 'resources/icons/Time'
import Clock from './Clock'

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
  }
}))

const CapmpaignPeriodModal = ({ opened, close }: { opened: boolean; close: () => void }) => {
  const { classes, cx } = useStyles()
  const [value, setValue] = useState<[Date | null, Date | null]>([null, null])
  const locale = useMemo(() => navigator && navigator.language.split('-')[0], [])
  const [selectDateOrTimeTab, setSelectDateOrTimeTab] = useState<DateOrTime>('date')
  const isDateTabSelected = useMemo(() => selectDateOrTimeTab === 'date', [selectDateOrTimeTab])
  const dateNow = useMemo(() => new Date(), [])
  const currentDate = useMemo(() => formatDateShort(dateNow), [dateNow])

  const startDateFormatted = useMemo(() => value[0] && formatDateShort(value[0]), [value])
  const endDateFormatted = useMemo(() => value[1] && formatDateShort(value[1]), [value])

  const handleSelectDateOrTimeTabClicked = useCallback(
    (tabValue: DateOrTime) => setSelectDateOrTimeTab(tabValue),
    []
  )
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
        <Grid.Col mt="xl" mb="xl">
          <Flex justify="center">
            <DatePicker
              size="lg"
              type="range"
              locale={locale}
              numberOfColumns={2}
              value={value}
              onChange={setValue}
              styles={(theme) => ({
                month: {
                  background: theme.colors.lightBackground[theme.fn.primaryShade()],
                  borderRadius: theme.radius.md
                }
              })}
            />
          </Flex>
        </Grid.Col>
        <Grid.Col p={0}>
          {/* <TimeInput label="Current time" withAsterisk /> */}
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
              <Text size="md">{startDateFormatted} 12:00</Text>
            </Flex>
            <Flex direction="column">
              <Text color="secondaryText" size="xs">
                End Date
              </Text>
              <Text size="md">
                {endDateFormatted}
                12:00
              </Text>
            </Flex>

            <Button variant="filled" size="lg">
              Apply
            </Button>
            <UnstyledButton variant="">Cancel</UnstyledButton>
          </Flex>
        </Grid.Col>
      </Grid>
    </Modal>
  )
}

export default CapmpaignPeriodModal
