import { useCallback, useMemo, useState } from 'react'
import { MantineTheme, MultiSelect, Radio, Stack, Text, getPrimaryShade } from '@mantine/core'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import { useColorScheme } from '@mantine/hooks'
import { createStyles } from '@mantine/emotion'

type MultiSelectAndRadioButtonsProps = {
  multiSelectData: { value: string; label: string }[]
  label: string
  defaultSelectValue?: string[]
  defaultRadioValue?: TargetingInputApplyProp
  onCategoriesChange: (selectedRadio: TargetingInputApplyProp, categories: string[]) => void
  groups: { [key: string]: string[] }
  error?: string
}

const useStyles = createStyles(
  (
    theme: MantineTheme,
    { selectedRadio, error }: { selectedRadio: TargetingInputApplyProp; error: boolean }
  ) => {
    const colorScheme = useColorScheme()
    const primaryShade = getPrimaryShade(theme, colorScheme)

    return {
      input: {
        textTransform: 'capitalize',
        ...(!error
          ? {
              borderColor:
                selectedRadio === 'nin'
                  ? theme.colors.warning[primaryShade]
                  : theme.colors.brand[primaryShade]
            }
          : {}),
        backgroundColor: theme.colors.mainBackground[primaryShade],
        boxShadow: theme.shadows.md
      },
      pill: {
        textTransform: 'capitalize',
        border: '1px solid',
        borderColor:
          selectedRadio === 'nin'
            ? theme.colors.warning[primaryShade]
            : theme.colors.brand[primaryShade],
        color:
          selectedRadio === 'nin'
            ? theme.colors.warning[primaryShade]
            : theme.colors.brand[primaryShade]
      }
    }
  }
)

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
    const groupsArr = [
      {
        group: 'Groups',
        items: Object.keys(groups).map((region) => ({
          label: region,
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
  const [selectedValue, setSelectedValue] = useState<string[]>(defaultSelectValue)
  const { classes } = useStyles({ selectedRadio, error: !!error })

  const handleRadioChange = useCallback(
    (value: string) => {
      setSelectedRadio(value as TargetingInputApplyProp)
      onCategoriesChange(value as TargetingInputApplyProp, selectedValue)
    },
    [onCategoriesChange, selectedValue]
  )

  const handleSelectChange = useCallback(
    (value: string[]) => {
      const nexVal: Array<string> = []

      if (selectedRadio !== 'all') {
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

        nexVal.push(...Array.from(newSelectedValues))
      }

      setSelectedValue(nexVal)
      onCategoriesChange(selectedRadio, nexVal)
    },
    [groups, onCategoriesChange, selectedRadio]
  )

  const labelText = useMemo(() => {
    if (selectedRadio === 'in') return `Select ${label}`
    if (selectedRadio === 'nin') return `Select ${label} to exclude`
    if (selectedRadio === 'all') return 'All selected'
    return ''
  }, [selectedRadio, label])

  return (
    <>
      <Radio.Group value={selectedRadio} onChange={handleRadioChange} mb="md">
        <Stack gap="xs">
          <Radio label="Select All" value="all" />
          <Radio label={`Select ${label}`} value="in" />
          <Radio label={`Select All ${label} Except`} value="nin" />
        </Stack>
      </Radio.Group>
      <MultiSelect
        label={
          <Text c="secondaryText" size="sm" fw="bold" mb="xs">
            {labelText}
          </Text>
        }
        clearable
        searchable
        variant="filled"
        size="lg"
        radius="lg"
        // NOTE: just visually show the nothing but keeps the value in case of change - will not need to select again
        value={selectedRadio === 'all' ? [] : selectedValue}
        disabled={selectedRadio === 'all'}
        data={data}
        onChange={handleSelectChange}
        placeholder={`Select ${label}`}
        error={error || null}
        classNames={{
          input: classes.input,
          pill: classes.pill
        }}
      />
    </>
  )
}

export default MultiSelectAndRadioButtons
