import { Accordion, Text } from '@mantine/core'
import { useMemo } from 'react'
import { TargetingInputSingle } from 'adex-common/dist/types'
import { SelectData } from 'types'

type CatsLocsFormattedProps = {
  title?: string
  inputValues: TargetingInputSingle
  selectData: SelectData[]
  align?: 'start' | 'end'
}

const CatsLocsFormatted = ({ title, inputValues, selectData, align }: CatsLocsFormattedProps) => {
  const values: string[] = useMemo(() => {
    return (inputValues.apply !== 'all' ? inputValues[inputValues.apply] : []).map(
      (x) => selectData.find((d) => d.value === x)?.label || ''
    )
  }, [inputValues, selectData])

  const texOnly = useMemo(() => inputValues.apply === 'all', [inputValues])

  return (
    <>
      {title && (
        <Text size="sm" c="dimmed" ta={align}>
          {title}
        </Text>
      )}
      {inputValues.apply === 'all' ? (
        <Text size="md" truncate ta={align}>
          All
        </Text>
      ) : (
        <Accordion w="100%">
          <Accordion.Item value={values[0]} key={values[0]} style={{ border: 0 }}>
            <Accordion.Control px="xs" chevron={texOnly ? <div /> : undefined} disabled={texOnly}>
              {inputValues.apply === 'nin' && <Text c="warning">All except: </Text>}
              <Text size="md" truncate ta={align}>
                {`${values.join(', ')}`}
              </Text>
            </Accordion.Control>

            <Accordion.Panel px={0}>
              <Text size="sm" ta={align}>
                {values.join(', ')}
              </Text>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </>
  )
}

export default CatsLocsFormatted
