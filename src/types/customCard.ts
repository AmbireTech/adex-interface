import { MantineColor } from '@mantine/core'

export interface ICustomCardProps {
  icon?: React.ReactNode
  iconLeft?: React.ReactNode
  color: MantineColor
  title?: string
  text: string
  width: number
  height: number
  children?: React.ReactNode
  action?: () => void
  component?: any
  to?: string
  active?: boolean
}

export interface ICustomCardStyleProps {
  color: MantineColor
  width: number
  height: number
  hasAction: boolean
}
