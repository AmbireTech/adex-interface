import { Badge, BadgeProps, Flex, MantineColor, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { ReactNode } from 'react'

const useStyles = createStyles((theme, { color }: { color: string }) => ({
  wrapper: {
    background: theme.colors[color][3] + theme.other.shades.hexColorSuffix.lightest,
    fontWeight: 'normal',
    textTransform: 'capitalize'
  }
}))

type CustomBadgeProps = BadgeProps & {
  color: MantineColor
  text: string
  icon?: ReactNode
}

const CustomBadge = ({ color, text, icon, ...rest }: CustomBadgeProps) => {
  const { classes } = useStyles({ color })
  return (
    <Badge size="lg" variant="outline" color={color} className={classes.wrapper} {...rest}>
      <Flex align="center" wrap="nowrap">
        <Text mr={icon ? 'xs' : undefined}>{text}</Text>
        {icon}
      </Flex>
    </Badge>
  )
}

export default CustomBadge
