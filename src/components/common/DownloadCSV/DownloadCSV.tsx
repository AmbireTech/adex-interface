import { Flex, Text, UnstyledButton } from '@mantine/core'
import DownloadIcon from 'resources/icons/Download'

interface DownloadCSVProps {
  data: any[] | undefined
  filename: string
  mapHeadersToDataProperties: any
}

const DownloadCSV = ({ data, filename, mapHeadersToDataProperties }: DownloadCSVProps) => {
  const convertToCSV = (dataToConvert: any[] | undefined, mappingHeaders?: any) => {
    const headerRow = Object.keys(mappingHeaders).join(',')
    const csvRows = []

    csvRows.push(headerRow)

    dataToConvert?.forEach((item) => {
      const values = Object.keys(mappingHeaders).map((header: string) => {
        const propertyName = mappingHeaders[header]
        const escapedValue = item[propertyName].toString().replace(/"/g, '""')
        return `"${escapedValue}"`
      })
      csvRows.push(values.join(','))
    })

    return csvRows.join('\n')
  }

  const downloadCSV = (
    dataCSV: any[] | undefined,
    filenameCSV: string,
    mapping: object | undefined
  ) => {
    const csv = convertToCSV(dataCSV, mapping)
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
    <UnstyledButton onClick={handleDownload}>
      <Flex align="center">
        <Text size="sm" mr="sm">
          Download CSV
        </Text>
        <DownloadIcon size="24px" />
      </Flex>
    </UnstyledButton>
  )
}

export default DownloadCSV
