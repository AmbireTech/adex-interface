// TODO: all these functions have to be in adex-common
export function stringToBigNum(amount: string | number): bigint {
  return typeof amount === 'string' ? BigInt(amount) : BigInt(amount) // TODO: remove this, temp fixup old DB non-string amounts
}

export function parseToBigNumPrecision(amount: number, decimals: number): bigint {
  const amountIntScaled = Number((10 ** decimals * amount).toFixed(0))
  return BigInt(amountIntScaled)
}

export function parseBigNumWithPrecisionToUSD(amount: bigint): number {
  return Number(amount) / 10 ** 8
}

export function parseBigNumTokenAmountToDecimal(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals
}

export function convertUSDBigNumPrecisionToBigNumToken(amount: bigint, decimals: number): bigint {
  return amount / BigInt(10 ** (8 - decimals))
}
