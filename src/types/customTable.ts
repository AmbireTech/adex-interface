import { PropsWithChildren } from 'react'
import { IInvoices } from './invoices'
import { IStatements } from './statements'

export interface ICustomTableProps extends PropsWithChildren {
  headings: string[]
  elements: IInvoices[] | IStatements[] | any[]
  onPreview?: (e: any) => any
}
