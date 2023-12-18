import { MultiSelect, Radio, Stack, Text } from '@mantine/core'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface MultiSelectAndRadioButtonsProps {
  multiSelectData: { value: string; label: string }[]
  label: string
  defaultSelectValue?: string[]
  defaultRadioValue?: TargetingInputApplyProp
  onCategoriesChange: (selectedRadio: TargetingInputApplyProp, categories: string[]) => void
}

const MultiSelectAndRadioButtons = ({
  multiSelectData,
  label,
  defaultSelectValue = [],
  defaultRadioValue = 'all',
  onCategoriesChange
}: MultiSelectAndRadioButtonsProps) => {
  const data = useMemo(() => [...multiSelectData], [multiSelectData])
  const [selectedRadio, setSelectedRadio] = useState<TargetingInputApplyProp>(defaultRadioValue)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<string[]>(defaultSelectValue)

  const handleRadioChange = useCallback((value: TargetingInputApplyProp) => {
    setSelectedRadio(value)
    setSelectedCategories([])
    setSelectedValue([])
  }, [])

  useEffect(() => {
    if (selectedRadio === 'all') setSelectedCategories([])
    else setSelectedCategories(selectedValue)
  }, [selectedRadio, selectedValue])

  const memoizedOnCategoriesChange = useMemo(() => onCategoriesChange, [onCategoriesChange])

  useEffect(() => {
    memoizedOnCategoriesChange(selectedRadio, selectedCategories)
  }, [memoizedOnCategoriesChange, selectedRadio, selectedCategories])

  return (
    <>
      <Radio.Group value={selectedRadio} onChange={handleRadioChange} mb="md">
        <Stack spacing="xs">
          <Radio label="Select All" value="all" />
          <Radio label={`Select ${label}`} value="in" />
          <Radio label={`Select All ${label} Except`} value="nin" />
        </Stack>
      </Radio.Group>
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        {selectedRadio === 'in'
          ? `Select ${label}`
          : selectedRadio === 'nin'
          ? `Select ${label} to exclude`
          : ''}
      </Text>
      <MultiSelect
        searchable
        variant="filled"
        size="lg"
        radius="lg"
        value={selectedValue}
        disabled={selectedRadio === 'all'}
        data={data}
        onChange={setSelectedValue}
        placeholder={`Select ${label}`}
        styles={(theme) => ({
          input: {
            borderColor:
              selectedRadio === 'nin'
                ? theme.colors.warning[theme.fn.primaryShade()]
                : theme.colors.brand[theme.fn.primaryShade()],
            backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
            boxShadow: theme.shadows.md
          },
          value: {
            border: '1px solid',
            borderColor:
              selectedRadio === 'nin'
                ? theme.colors.warning[theme.fn.primaryShade()]
                : theme.colors.brand[theme.fn.primaryShade()],
            color:
              selectedRadio === 'nin'
                ? theme.colors.warning[theme.fn.primaryShade()]
                : theme.colors.brand[theme.fn.primaryShade()]
          }
        })}
      />
    </>
  )
}

export default MultiSelectAndRadioButtons
