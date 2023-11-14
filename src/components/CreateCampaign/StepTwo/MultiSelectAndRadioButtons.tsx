import { MultiSelect, Radio, Stack, Text } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'

type RadioBtnCategories = 'selectAll' | 'selectSome' | 'selectAllExcept'

const MultiSelectAndRadioButtons = ({
  multiSelectData,
  label
}: {
  multiSelectData: { value: string; label: string }[]
  label: string
}) => {
  const data = useMemo(() => [...multiSelectData], [multiSelectData])
  const [selectedRadio, setSelectedRadio] = useState<RadioBtnCategories>('selectAll')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const handleRadioChange = useCallback(
    (value: RadioBtnCategories) => {
      setSelectedRadio(value)

      if (value === 'selectAll') {
        const allCatsSelected = data.map((i) => i.value)
        setSelectedCategories(allCatsSelected)
      } else {
        setSelectedCategories([])
      }
    },
    [data]
  )

  const handleMultiSelectChange = useCallback((selected: any) => {
    setSelectedCategories(selected)
  }, [])

  useEffect(() => {
    if (selectedRadio === 'selectAllExcept') {
      const allCatsSelectedExcept = data.filter(
        (category) => !selectedCategories.includes(category.value)
      )
      console.log('allCatsSelectedExcept', allCatsSelectedExcept)
    }
  }, [data, selectedCategories, selectedRadio])

  console.log('selectedCategories', selectedCategories)

  return (
    <>
      <Radio.Group value={selectedRadio} onChange={handleRadioChange} mb="md">
        <Stack spacing="xs">
          <Radio label="Select All" value="selectAll" />
          <Radio label={`Select ${label}`} value="selectSome" />
          <Radio label={`Select All ${label} Except`} value="selectAllExcept" />
        </Stack>
      </Radio.Group>
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        {selectedRadio === 'selectSome'
          ? `Select ${label}`
          : selectedRadio === 'selectAllExcept'
          ? `Select ${label} to exclude`
          : ''}
      </Text>
      <MultiSelect
        variant="filled"
        size="lg"
        radius="lg"
        disabled={selectedRadio === 'selectAll'}
        data={data}
        onChange={handleMultiSelectChange}
        placeholder={`Select ${label}`}
        styles={(theme) => ({
          input: {
            borderColor:
              selectedRadio === 'selectAllExcept'
                ? theme.colors.warning[theme.fn.primaryShade()]
                : theme.colors.brand[theme.fn.primaryShade()],
            backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
            boxShadow: theme.shadows.md
          },
          value: {
            border: '1px solid',
            borderColor:
              selectedRadio === 'selectAllExcept'
                ? theme.colors.warning[theme.fn.primaryShade()]
                : theme.colors.brand[theme.fn.primaryShade()],
            color:
              selectedRadio === 'selectAllExcept'
                ? theme.colors.warning[theme.fn.primaryShade()]
                : theme.colors.brand[theme.fn.primaryShade()]
          }
        })}
      />
    </>
  )
}

export default MultiSelectAndRadioButtons
