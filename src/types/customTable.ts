import { IInvoices } from './invoices'
import { IStatements } from './statements'

export interface ICustomTableProps {
  headings: string[]
  elements: IInvoices[] | IStatements[] | any[]
}
