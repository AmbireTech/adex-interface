import { AnchorProps, MantineColor } from '@mantine/core'

export interface ICustomAnchorStylesProps {
  color: MantineColor
}
export interface ICustomAnchor extends AnchorProps {
  href: string
  target: string
  externalIcon?: boolean
  isExternal?: boolean
  color: MantineColor
}
