import { Text, Group } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { RangeTextProps } from 'types'

const useStyles = createStyles((theme) => ({
  borderLeft: {
    borderLeft: '1px solid',
    borderColor: theme.colors.decorativeBorders[3]
  }
}))

const RangeText = ({ labelOne, valueOne, labelTwo, valueTwo }: RangeTextProps) => {
  const { classes } = useStyles()
  return (
    <Group gap="xs">
      <Group gap="xs">
        <Text color="brand" size="sm">
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
