import { PropsWithChildren } from 'react'
import { IInvoices } from 'types'

export interface ICustomTableProps extends PropsWithChildren {
  background?: boolean
  headings: string[]
  elements: IInvoices[] | any[]
  onPreview?: (e: any) => any
  onAnalytics?: (e: any) => any
  onDuplicate?: (e: any) => any
  onDelete?: (e: any) => any
}
