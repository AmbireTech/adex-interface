import { MantineColor } from '@mantine/core'

export interface ChartControlBtnStyleProps {
  bgColor: MantineColor
  whiteFontColor: boolean
}

export interface ChartControlBtnProps {
  value: string | number
  text: string
  bgColor: MantineColor
  onClick: any
  whiteFontColor?: boolean
}
