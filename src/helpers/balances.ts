import { ethers } from 'ethers'

export const formatUnits = (amount: BigInt, decimals: number) =>
  ethers.utils.formatUnits(amount.toString(), decimals)

export const parseUnits = (amount: string, decimals: number) =>
  ethers.utils.parseUnits(amount, decimals)
