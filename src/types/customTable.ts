import { PropsWithChildren } from 'react'
import { IInvoices } from 'types'
import { TableProps, MantineColor } from '@mantine/core'

type WithRowColor = {
  [index: string]: any
  rowColor?: MantineColor
}

export type ICustomTableProps = PropsWithChildren &
  TableProps & {
    background?: boolean
    headings: string[]
    elements: Array<WithRowColor> | Array<WithRowColor & IInvoices>
    pageSize?: number
    onPreview?: (e: any) => any
    onAnalytics?: (e: any) => any
    onDuplicate?: (e: any) => any
    onDelete?: (e: any) => any
    onArchive?: (e: any) => any
    onEdit?: (e: any) => any
  }
