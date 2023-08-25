export const formatCurrency = (value: number, numberOfDigits: number) => {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: numberOfDigits,
    maximumFractionDigits: numberOfDigits
  })
}
