import { AnchorProps } from '@mantine/core'

export interface ICustomAnchor extends AnchorProps {
  href: string
  target?: string
  label?: string
  externalIcon?: boolean
  component?: any
  fullWidth?: boolean
}
