import { useCallback, useEffect, useMemo, useState } from 'react'
import { MultiSelect, Radio, Stack, Text } from '@mantine/core'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import { MultiSelectAndRadioButtonsProps } from 'types'
import { capitalize } from 'helpers/createCampaignHelpers'

const MultiSelectAndRadioButtons = ({
  multiSelectData,
  label,
  defaultSelectValue = [],
  defaultRadioValue = 'all',
  onCategoriesChange,
  groups,
  error
}: MultiSelectAndRadioButtonsProps) => {
  const extendedData = useMemo(() => {
    const regions = Object.keys(groups).map((region) => ({
      label: capitalize(region),
      value: region,
      group: 'Groups'
    }))
    return [...regions, ...multiSelectData]
  }, [multiSelectData, groups])

  const data = useMemo(() => [...extendedData], [extendedData])
  const [selectedRadio, setSelectedRadio] = useState<TargetingInputApplyProp>(defaultRadioValue)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<string[]>(defaultSelectValue)

  const handleRadioChange = useCallback((value: TargetingInputApplyProp) => {
    setSelectedRadio(value)
    setSelectedCategories([])
    setSelectedValue([])
  }, [])

  const handleSelectChange = useCallback(
    (value: string[]) => {
      const newSelectedValues = new Set<string>()

      value.forEach((val) => {
        if (groups[val]) {
          groups[val].forEach((item) => {
            newSelectedValues.add(item)
          })
        } else {
          newSelectedValues.add(val)
        }
      })

      setSelectedValue(Array.from(newSelectedValues))
    },
    [groups]
  )

  const labelText = useMemo(() => {
    if (selectedRadio === 'in') return `Select ${label}`
    if (selectedRadio === 'nin') return `Select ${label} to exclude`
    return ''
  }, [selectedRadio, label])

  useEffect(() => {
    if (selectedRadio === 'all') setSelectedCategories([])
    else setSelectedCategories(selectedValue)
  }, [selectedRadio, selectedValue])

  useEffect(() => {
    onCategoriesChange(selectedRadio, selectedCategories)
  }, [onCategoriesChange, selectedRadio, selectedCategories])

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
        {labelText}
      </Text>
      <MultiSelect
        searchable
        variant="filled"
        size="lg"
        radius="lg"
        value={selectedValue}
        disabled={selectedRadio === 'all'}
        data={data}
        onChange={handleSelectChange}
        placeholder={`Select ${label}`}
        error={error && <Text size="sm">{error}</Text>}
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
