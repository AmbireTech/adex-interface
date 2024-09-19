import { AnchorProps } from '@mantine/core'
import { PropsWithChildren } from 'react'

export type CustomAnchorProps = PropsWithChildren &
  AnchorProps & {
    external?: boolean
  }
