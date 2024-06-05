// TODO: all these functions have to be in adex-common
export function stringToBigNum(amount: string | number): bigint {
  return typeof amount === 'string' ? BigInt(amount) : BigInt(amount) // TODO: remove this, temp fixup old DB non-string amounts
}

export function parseToBigNumPrecision(amount: number, decimals: number): bigint {
  const amountIntScaled = Number((10 ** decimals * amount).toFixed(0))
  return BigInt(amountIntScaled)
}

export function parseFromBigNumPrecision(amount: bigint, decimals: number): number {
  const scaledAmount = Number(amount)
  const divisor = 10 ** decimals
  return scaledAmount / divisor
}

export function parseBigNumTokenAmountToDecimal(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals
}
