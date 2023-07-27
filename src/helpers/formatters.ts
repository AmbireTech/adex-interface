export const formatDate = (date: Date) => {
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const weekday = weekdays[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]
  const year = date.getFullYear()

  return `${weekday}, ${day} ${month} ${year}`
}

export const maskAddress = (address: string) =>
  address.length
    ? `${address.substring(0, 8)}...${address.substring(address.length - 6, address.length)}`
    : ''

export const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)
