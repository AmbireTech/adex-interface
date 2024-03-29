import { Text, Group, createStyles } from '@mantine/core'
import { RangeTextProps } from 'types'

const useStyles = createStyles((theme) => ({
  borderLeft: {
    borderLeft: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()]
  }
}))

const RangeText = ({ labelOne, valueOne, labelTwo, valueTwo }: RangeTextProps) => {
  const { classes } = useStyles()
  return (
    <Group spacing="xs">
      <Group spacing="xs">
        <Text color="brand" size="sm">
          {labelOne}:
        </Text>
        <Text>{valueOne}</Text>
      </Group>
      <Group spacing="xs" className={classes.borderLeft} pl="xs">
        <Text color="brand" size="sm">
          {labelTwo}:
        </Text>
        <Text>{valueTwo}</Text>
      </Group>
    </Group>
  )
}

export default RangeText
