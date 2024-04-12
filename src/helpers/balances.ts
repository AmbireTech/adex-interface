import { ethers } from 'ethers'

export const formatUnits = (amount: BigInt, decimals: number) =>
  ethers.utils.formatUnits(amount.toString(), decimals)
