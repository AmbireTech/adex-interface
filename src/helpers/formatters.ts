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

export const maskAddress = (address: string) =>
  address.length
    ? `${address.substring(0, 8)}...${address.substring(address.length - 6, address.length)}`
    : ''

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
