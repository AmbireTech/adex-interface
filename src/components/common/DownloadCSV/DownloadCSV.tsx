import { Button, ThemeIcon } from '@mantine/core'
import { AdUnit } from 'adex-common'
import DownloadIcon from 'resources/icons/Download'
import { BaseAnalyticsData, Country, Hostname } from 'types'

type GenericHeader = { [key: string]: string }
export type CSVDataType = BaseAnalyticsData[]
export type CSVHeadersType = Hostname | Country | AdUnit | GenericHeader
interface DownloadCSVProps {
  data: CSVDataType | undefined
  filename: string
  mapHeadersToDataProperties: CSVHeadersType
  disabled?: boolean
}

const DownloadCSV = ({
  data,
  filename,
  mapHeadersToDataProperties,
  disabled
}: DownloadCSVProps) => {
  const convertToCSV = (
    dataToConvert: CSVDataType | undefined,
    mappingHeaders?: CSVHeadersType | undefined
  ) => {
    if (!mappingHeaders) return
    const headers = Object.keys(mappingHeaders)
    const headerRow = headers.join(',')
    const csvRows: string[] = [headerRow]

    dataToConvert?.forEach((item) => {
      const values = headers.map((header) => {
        const propertyName = mappingHeaders[
          header as keyof CSVHeadersType
        ] as keyof BaseAnalyticsData
        if (propertyName === 'share') {
          const totalPaid = dataToConvert.reduce((sum, i) => sum + i.paid, 0) || 1
          return `${((item.paid / totalPaid) * 100).toFixed(2)} %`
        }
        const value = item[propertyName]
        const escapedValue = value ? value.toString().replace(/"/g, '""') : ''
        return `"${escapedValue}"`
      })
      csvRows.push(values.join(','))
    })

    return csvRows.join('\n')
  }

  const downloadCSV = (
    dataCSV: CSVDataType | undefined,
    filenameCSV: string,
    mapping: CSVHeadersType | undefined
  ) => {
    const csv = convertToCSV(dataCSV, mapping)
    if (!csv) return
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filenameCSV)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownload = () => {
    downloadCSV(data, filename, mapHeadersToDataProperties)
  }
  return (
    <Button
      onClick={handleDownload}
      disabled={disabled}
      size="sm"
      color="mainText"
      variant="transparent"
      rightSection={
        <ThemeIcon size="sm" variant="transparent" c="inherit">
          <DownloadIcon size="inherit" />
        </ThemeIcon>
      }
    >
      .CSV
    </Button>
  )
}

export default DownloadCSV
