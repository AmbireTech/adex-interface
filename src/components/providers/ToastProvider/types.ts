import { ReactNode } from 'react'

export type ToastPositionType =
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'center'
    | 'hidden'
    | 'left'
    | 'right'
    | 'top'
    | 'top-left'
    | 'top-right'

export type ToastStatusType =
    | 'unknown'
    | 'ok'
    | 'warning'
    | 'error'
    | 'critical'
    | 'disabled'

export type ToastOptions = {
    timeout?: number,
    error?: boolean,
    position?: ToastPositionType,
    sticky?: boolean,
    badge?: ReactNode,
    onClick?: () => {},
    url?: string,
    route?: string,
    status?: ToastStatusType
}


export interface IToastProvider {
    addToast: (content: ReactNode, options?: ToastOptions) => number,
    removeToast: (id: number) => void
}

export interface Toast extends ToastOptions {
    id: number,
    content: ReactNode,
    ref: any
}