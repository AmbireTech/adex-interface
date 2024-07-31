import { Accordion, Text } from '@mantine/core'
import { useCallback, useMemo } from 'react'

type CatsLocsFormattedProps = {
  title?: string
  arr: (string | null)[]
}

const CatsLocsFormatted = ({ title, arr }: CatsLocsFormattedProps) => {
  if (!arr) return null
  const [itemKey, items] = useMemo(() => arr, [arr])
  const values = useMemo(() => items && items?.split(','), [items])

  const formatPrefix = useCallback((key: string | undefined) => {
    let prefix = ''
    let color = 'info'
    switch (key) {
      case 'all':
        prefix = 'All '
        break
      case 'nin':
        prefix = 'All except: '
        color = 'warning'
        break
      default:
        break
    }

    return (
      <Text color={color} span>
        {prefix}
      </Text>
    )
  }, [])

  return values ? (
    <Accordion w="100%">
      <Accordion.Item value={values[0]} key={values[0]} style={{ border: 0 }}>
        <Accordion.Control px="xs">
          {title && (
            <Text size="sm" color="dimmed">
              {title}
            </Text>
          )}
          <Text size="md" truncate>
            {formatPrefix(itemKey!)}
            {`${values.join(', ')}...`}
          </Text>
        </Accordion.Control>
        {values.length > 3 && (
          <Accordion.Panel px={0}>
            <Text>{values.join(', ')}</Text>
          </Accordion.Panel>
        )}
      </Accordion.Item>
    </Accordion>
  ) : null
}

export default CatsLocsFormatted
