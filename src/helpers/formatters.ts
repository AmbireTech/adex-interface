import dayjs from 'dayjs'

export const formatCurrency = (value: number, numberOfDigits: number) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: numberOfDigits,
    maximumFractionDigits: numberOfDigits
  })
}
export const formatDate = (date: Date) =>
  date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

export const formatDateShort = (date: Date) =>
  date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  })
export const formatDateShortForDownload = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`

export const formatTimeShort = () => {
  const date = new Date()

  return date.toLocaleTimeString(undefined, {
    timeStyle: 'medium'
  })
}

export const formatTime = (dateTime: dayjs.Dayjs | undefined): string => {
  return dayjs(dateTime).format('HH:mm')
}

export const formatDateTime = (dateTime: Date): string => {
  return dayjs(dateTime).format('DD/MM/YY HH:mm')
}

export const maskAddress = (address: string) =>
  address.length
    ? `${address.substring(0, 8)}...${address.substring(address.length - 6, address.length)}`
    : ''

export const getMonthRangeString = (date: Date): string => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1)
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  return `${formatDateShort(first)} - ${formatDateShort(last)}`
}

export const monthPeriodIndex = (date: Date): string =>
  `${date.getUTCFullYear()}-${date.getUTCMonth()}`

export const monthPeriodIndexToDate = (index: string): Date => {
  const split = index.split('-')
  return new Date(Number(split[0]), Number(split[1]))
}
