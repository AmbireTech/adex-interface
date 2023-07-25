import { MantineColor } from '@mantine/core'

export enum CustomCardType {
  depositBtn,
  billingBtn
}

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
  type?: CustomCardType
}

export interface ICustomCardStyleProps {
  color: MantineColor
  width: number | string
  height: number | string
  isBillingBtn: boolean
  isDepositBtn: boolean
}
