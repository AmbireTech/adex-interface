import { PropsWithChildren, ReactNode } from 'react'

export interface IActionButtonProps extends PropsWithChildren {
  action: (e: any) => any
  icon: ReactNode
  title: string
}
