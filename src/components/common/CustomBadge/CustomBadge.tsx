import { Badge, BadgeProps, Flex, MantineColor, Text, createStyles } from '@mantine/core'
import { ReactNode } from 'react'

const useStyles = createStyles((theme, { color }: { color: string }) => ({
  wrapper: {
    background:
      theme.colors[color][theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest,
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
      <Flex align="center">
        <Text>{text}</Text>
        {icon}
      </Flex>
    </Badge>
  )
}

export default CustomBadge
