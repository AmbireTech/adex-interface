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
  groups
}: MultiSelectAndRadioButtonsProps) => {
  const extendedData = useMemo(() => {
    const groupsArr = [
      {
        group: 'Groups',
        items: Object.keys(groups).map((region) => ({
          label: capitalize(region),
          value: region
        }))
      },
      {
        group: label,
        items: [...multiSelectData]
      }
    ]

    return [...groupsArr]
  }, [multiSelectData, groups, label])

  const data = useMemo(() => [...extendedData], [extendedData])
  const [selectedRadio, setSelectedRadio] = useState<TargetingInputApplyProp>(defaultRadioValue)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedValue, setSelectedValue] = useState<string[]>(defaultSelectValue)

  const handleRadioChange = useCallback((value: string) => {
    setSelectedRadio(value as TargetingInputApplyProp)
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
        <Stack gap="xs">
          <Radio label="Select All" value="all" />
          <Radio label={`Select ${label}`} value="in" />
          <Radio label={`Select All ${label} Except`} value="nin" />
        </Stack>
      </Radio.Group>
      <Text c="secondaryText" size="sm" fw="bold" mb="xs">
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
        styles={(theme) => ({
          input: {
            borderColor: selectedRadio === 'nin' ? theme.colors.warning[3] : theme.colors.brand[3],
            backgroundColor: theme.colors.mainBackground[3],
            boxShadow: theme.shadows.md
          },
          pill: {
            border: '1px solid',
            borderColor: selectedRadio === 'nin' ? theme.colors.warning[3] : theme.colors.brand[3],
            color: selectedRadio === 'nin' ? theme.colors.warning[3] : theme.colors.brand[3]
          }
        })}
      />
    </>
  )
}

export default MultiSelectAndRadioButtons
