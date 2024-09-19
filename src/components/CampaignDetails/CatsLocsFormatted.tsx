import { Spoiler, Text } from '@mantine/core'
import { useMemo } from 'react'
import { TargetingInputSingle } from 'adex-common/dist/types'
import { SelectData } from 'types'

type CatsLocsFormattedProps = {
  title?: string
  inputValues: TargetingInputSingle
  selectData: SelectData[]
  align?: 'start' | 'end'
}

const CatsLocsFormatted = ({
  title,
  inputValues,
  selectData,
  align = 'start'
}: CatsLocsFormattedProps) => {
  const values: string[] = useMemo(() => {
    return (inputValues.apply !== 'all' ? inputValues[inputValues.apply] : []).map(
      (x) => selectData.find((d) => d.value === x)?.label || ''
    )
  }, [inputValues, selectData])

  return (
    <>
      {title && (
        <Text size="sm" c="dimmed" ta={align}>
          {title}
        </Text>
      )}

      <Spoiler
        hideLabel="hide"
        showLabel="see all"
        maxHeight={50}
        w="100%"
        styles={{ control: { textAlign: align, width: '100%' } }}
      >
        {inputValues.apply === 'nin' && (
          <Text c="warning" ta={align}>
            All except:{' '}
          </Text>
        )}
        {inputValues.apply === 'all' && <Text ta={align}>All</Text>}
        <Text ta={align}>{values.join(', ')}</Text>
      </Spoiler>
    </>
  )
}

export default CatsLocsFormatted
