import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react'

export interface IActionButtonProps extends PropsWithChildren {
  action: MouseEventHandler<HTMLButtonElement>
  icon: ReactNode
  title: string
}
