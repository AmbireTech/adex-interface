import { useCallback, useMemo, useState } from 'react'
import {
  MantineTheme,
  MultiSelect,
  SegmentedControl,
  Stack,
  getPrimaryShade,
  Center,
  ThemeIcon,
  MantineSize
} from '@mantine/core'
import { TargetingInputApplyProp } from 'adex-common/dist/types'
import { useColorScheme } from '@mantine/hooks'
import { createStyles } from '@mantine/emotion'
import CheckMarkIcon from 'resources/icons/CheckMark'
import IncludeIcon from 'resources/icons/Include'
import ExcludeIcon from 'resources/icons/Exclude'

type MultiSelectAndRadioButtonsProps = {
  multiSelectData: { value: string; label: string }[]
  label: string
  defaultSelectValue?: string[]
  defaultRadioValue?: TargetingInputApplyProp
  onCategoriesChange: (selectedRadio: TargetingInputApplyProp, categories: string[]) => void
  groups: { [key: string]: string[] }
  error?: string
  size?: MantineSize
}

const useStyles = createStyles(
  (theme: MantineTheme, { color, error }: { color: string; error: boolean }) => {
    const colorScheme = useColorScheme()
    const primaryShade = getPrimaryShade(theme, colorScheme)
    const stylesColor = theme.colors[color][primaryShade]

    return {
      input: {
        textTransform: 'capitalize',
        ...(!error
          ? {
              borderColor: stylesColor
            }
          : {}),
        backgroundColor: theme.colors.mainBackground[primaryShade],
        boxShadow: theme.shadows.md
      },
      pill: {
        textTransform: 'capitalize',
        border: '1px solid',
        borderColor: stylesColor,
        color: stylesColor
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
  error,
  size = 'md'
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

  const color = useMemo(() => {
    switch (selectedRadio) {
      case 'all':
        return 'success'
      case 'nin':
        return 'warning'
      case 'in':
        return 'brand'
      default:
        return 'grey'
    }
  }, [selectedRadio])

  const { classes } = useStyles({ color, error: !!error })

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

  return (
    <Stack gap="xs">
      <SegmentedControl
        color={color}
        size={size}
        value={selectedRadio}
        onChange={handleRadioChange}
        withItemsBorders={false}
        data={[
          {
            label: (
              <Center style={{ gap: 10 }}>
                <ThemeIcon size="sm" variant="transparent" c="inherit">
                  <CheckMarkIcon />
                </ThemeIcon>
                <span>All Selected</span>
              </Center>
            ),
            value: 'all'
          },
          {
            label: (
              <Center style={{ gap: 10 }}>
                <ThemeIcon size="xs" variant="transparent" c="inherit">
                  <IncludeIcon />
                </ThemeIcon>
                <span>Include Selected</span>
              </Center>
            ),
            value: 'in'
          },
          {
            label: (
              <Center style={{ gap: 10 }}>
                <ThemeIcon size="xs" variant="transparent" c="inherit">
                  <ExcludeIcon />
                </ThemeIcon>
                <span>Exclude Selected</span>
              </Center>
            ),
            value: 'nin'
          }
        ]}
      />
      <MultiSelect
        clearable
        searchable
        variant="filled"
        size={size}
        radius="md"
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
    </Stack>
  )
}

export default MultiSelectAndRadioButtons
