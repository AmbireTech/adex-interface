import { Flex, createStyles, rem, Image, Text } from '@mantine/core'
import { useMemo, useState } from 'react'
import DownArrowIcon from 'resources/icons/DownArrow'
import { formatCurrency } from 'helpers'
import { formatUnits } from 'helpers/balances'
import useAccount from 'hooks/useAccount'
import { getTokenIcon, networks } from 'lib/Icons'
import { DIGITS_AFTER_FLOATING_POINT } from 'constants/balances'

const useStyles = createStyles((theme) => ({
  rotateUpsideDown: {
    transform: 'scale(-1)'
  },
  pointer: {
    cursor: 'pointer'
  },
  secondaryColor: {
    color: theme.colors.secondaryText[theme.fn.primaryShade()]
  }
}))

const FormattedBalance = ({ balance, iconUrl }: { balance: number; iconUrl: string }) => {
  const formattedBalance = useMemo(
    () => formatCurrency(balance, DIGITS_AFTER_FLOATING_POINT),
    [balance]
  )

  const integerPart = useMemo(
    () => formattedBalance.substring(0, formattedBalance.length - DIGITS_AFTER_FLOATING_POINT),
    [formattedBalance]
  )
  const decimalPart = useMemo(
    () => formattedBalance.substring(formattedBalance.length - DIGITS_AFTER_FLOATING_POINT),
    [formattedBalance]
  )

  return (
    <Flex direction="row" align="center" justify="flex-start">
      <Image src={iconUrl} alt="token_icon" width={18} height={18} />
      <Flex direction="row" align="baseline" justify="flex-start">
        <Text size="lg" weight="bold" ml="xs">
          {integerPart}
        </Text>
        <Text size="sm" weight="bold">
          {decimalPart}
        </Text>
      </Flex>
    </Flex>
  )
}

const Balance = () => {
  const {
    adexAccount: {
      availableBalance,
      balanceToken,
      fundsDeposited: { deposits }
    }
  } = useAccount()

  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState(false)
  const iconUrl = useMemo(
    () => getTokenIcon(balanceToken.chainId, balanceToken.address),
    [balanceToken.chainId, balanceToken.address]
  )

  const formattedToken = useMemo(
    () => Number(formatUnits(availableBalance, balanceToken.decimals)),
    [availableBalance, balanceToken.decimals]
  )
  return (
    <>
      <Text size="sm" color="mainText" weight="bold">
        Balance
      </Text>
      <Flex direction="row" align="center" justify="space-between">
        <FormattedBalance balance={formattedToken} iconUrl={iconUrl} />
        {/* TODO: temporary disabled */}
        {/* {!!deposits.length && ( */}
        {false && (
          <DownArrowIcon
            size={rem(10)}
            className={cx(classes.pointer, { [classes.rotateUpsideDown]: opened })}
            onClick={() => setOpened((prevState) => !prevState)}
          />
        )}
      </Flex>

      {opened && (
        <Flex direction="column">
          {deposits.map((item) => (
            <Flex
              justify="space-between"
              key={item.created.toString()}
              className={classes.secondaryColor}
            >
              <Flex align="center">
                <Image
                  maw={15}
                  mx="auto"
                  radius="md"
                  src={getTokenIcon(item.token.chainId, item.token.address)}
                  alt={item.token.name}
                />
                <Text size="xs" ml="xs">
                  {Number(formatUnits(item.amount, item.token.decimals))} {item.token.name}
                </Text>
              </Flex>
              <Text size="xs">on {networks[item.token.chainId]}</Text>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  )
}

export default Balance
