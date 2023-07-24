import { MantineColor } from '@mantine/core'

export interface ICustomCardProps {
  icon?: React.ReactNode
  iconLeft?: React.ReactNode
  color: MantineColor
  title?: string
  text: string
  width: number | string
  height: number | string
  children?: React.ReactNode
  action?: () => void
  component?: any
  to?: string
  active?: boolean
  border?: boolean
}

export interface ICustomCardStyleProps {
  color: MantineColor
  width: number | string
  height: number | string
  hasAction: boolean
  hasBorder: boolean
}
