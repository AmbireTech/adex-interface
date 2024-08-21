import { Badge, BadgeProps, MantineColor, MantineSize, ThemeIcon } from '@mantine/core'
import { ReactNode } from 'react'

type CustomBadgeProps = BadgeProps & {
  color: MantineColor
  text: string
  icon?: ReactNode
  size?: MantineSize
}

const CustomBadge = ({ color, text, icon, size = 'lg', ...rest }: CustomBadgeProps) => {
  return (
    <Badge
      size={size}
      variant="light"
      color={color}
      tt="capitalize"
      fw="normal"
      styles={{
        root: {
          borderColor: 'inherit'
        }
      }}
      rightSection={
        icon && (
          <ThemeIcon variant="transparent" c="inherit">
            {icon}
          </ThemeIcon>
        )
      }
      {...rest}
    >
      {text}
    </Badge>
  )
}

export default CustomBadge
