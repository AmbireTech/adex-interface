import { MantineColor } from '@mantine/core'

export interface IDepositMethodButtonStylesProps {
  color: MantineColor
}

export interface IDepositMethodButtonProps {
  icon: React.ReactNode
  label: string
  color: MantineColor
  active: boolean
  action: () => void
}
