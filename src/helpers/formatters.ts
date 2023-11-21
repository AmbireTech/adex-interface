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

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
