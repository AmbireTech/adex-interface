import { Accordion, Flex, MantineTheme, Text, getPrimaryShade, lighten } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { useCallback, useMemo } from 'react'

type CatsLocsFormattedProps = {
  title: string
  arr: (string | null)[]
}

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    lighterColor: {
      color: lighten(theme.colors.secondaryText[primaryShade], theme.other.shades.lighten.lighter)
    },
    warningColor: {
      color: theme.colors.warning[primaryShade]
    },
    firstLineLabels: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }
})

const CatsLocsFormatted = ({ title, arr }: CatsLocsFormattedProps) => {
  const { classes } = useStyles()
  if (!arr) return null
  const [itemKey, items] = useMemo(() => arr, [arr])
  const values = useMemo(() => items && items?.split(','), [items])

  const formatPrefix = useCallback(
    (key: string | undefined) => {
      if (!key) return
      if (key === 'all') {
        return <span>All</span>
      }
      if (key === 'in') {
        return null
      }
      if (key === 'nin') {
        return <span className={classes.warningColor}>All except: </span>
      }
    },
    [classes.warningColor]
  )

  return (
    <div>
      {!values && (
        <Flex direction="column" p="md">
          <Text size="sm" className={classes.lighterColor}>
            {title}
          </Text>
          <Text className={classes.firstLineLabels}>{formatPrefix(itemKey!)}</Text>
        </Flex>
      )}
      {!!values &&
        (values.length <= 3 ? (
          <Flex direction="column" p="md">
            <Text size="sm" className={classes.lighterColor}>
              {title}
            </Text>
            <Text className={classes.firstLineLabels}>
              {formatPrefix(itemKey!)}
              {values.slice(0, 3).join(', ')}
            </Text>
          </Flex>
        ) : (
          <Accordion>
            <Accordion.Item value={values[0]} key={values[0]}>
              <Accordion.Control>
                <Text size="sm" className={classes.lighterColor}>
                  {title}
                </Text>
                <Text className={classes.firstLineLabels}>
                  {formatPrefix(itemKey!)}
                  {`${values.slice(0, 3).join(', ')}...`}
                </Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Text>{values.slice(3, values.length - 1).join(', ')}</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ))}
    </div>
  )
}

export default CatsLocsFormatted
