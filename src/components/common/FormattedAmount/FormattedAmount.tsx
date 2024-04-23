import { Flex, Image, Text } from '@mantine/core'
import { DIGITS_AFTER_FLOATING_POINT } from 'constants/balances'
import { formatCurrency, parseBigNumTokenAmountToDecimal } from 'helpers'
import { getTokenIcon } from 'lib/Icons'

type FormattedAmountProps = {
  chainId: number
  tokenAddress: string
  amount: bigint
  tokenDecimals: number
  isCPMAmount?: boolean
}

const FormattedAmount = ({
  chainId,
  tokenAddress,
  amount,
  tokenDecimals,
  isCPMAmount = false
}: FormattedAmountProps) => (
  <Flex align="center">
    <Image
      maw={15}
      mx="auto"
      radius="md"
      src={getTokenIcon(chainId, tokenAddress)}
      alt={tokenAddress}
    />
    <Text ml="xs">
      {formatCurrency(
        isCPMAmount
          ? Number(parseBigNumTokenAmountToDecimal(amount, tokenDecimals)) * 1000
          : Number(parseBigNumTokenAmountToDecimal(amount, tokenDecimals)),
        DIGITS_AFTER_FLOATING_POINT
      )}
    </Text>
  </Flex>
)

export default FormattedAmount
