import { FlexProps, MantineNumberSize } from '@mantine/core'

export type CollapsibleFieldProps = {
  label: string
  children: React.ReactNode
}

export type CollapsibleFieldStylesProps = {
  collapsed: boolean
}

export type CampaignDetailsRowProps = FlexProps & {
  title: string
  value: any | undefined
  lighterColor?: boolean | undefined
  textSize?: MantineNumberSize
  noBorder?: boolean
  column?: boolean
  lineHeight?: MantineNumberSize
}
