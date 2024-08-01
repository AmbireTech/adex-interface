import { Text, Group, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { RangeTextProps } from 'types'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    borderLeft: {
      borderLeft: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade]
    }
  }
})

const RangeText = ({ labelOne, valueOne, labelTwo, valueTwo }: RangeTextProps) => {
  const { classes } = useStyles()
  return (
    <Group gap="xs">
      <Group gap="xs">
        <Text c="brand" size="sm">
          {labelOne}:
        </Text>
        <Text>{valueOne}</Text>
      </Group>
      <Group gap="xs" className={classes.borderLeft} pl="xs">
        <Text c="brand" size="sm">
          {labelTwo}:
        </Text>
        <Text>{valueTwo}</Text>
      </Group>
    </Group>
  )
}

export default RangeText
