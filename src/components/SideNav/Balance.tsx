import { Flex, createStyles, rem, Image, Text } from '@mantine/core'
import { useState } from 'react'

import DownArrowIcon from 'resources/icons/DownArrow'
import { formatCurrency } from 'helpers'
import { accountBalance } from './mockedData'

const DIGITS_AFTER_FLOATING_POINT: number = 2

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

const FormattedBalance = ({ balance }: { balance: number }) => {
  const formattedBalance = formatCurrency(balance, DIGITS_AFTER_FLOATING_POINT)

  const integerPart = formattedBalance.substring(
    0,
    formattedBalance.length - DIGITS_AFTER_FLOATING_POINT
  )
  const decimalPart = formattedBalance.substring(
    formattedBalance.length - DIGITS_AFTER_FLOATING_POINT
  )

  return (
    <Flex direction="row" align="baseline" justify="flex-start">
      <Text size="lg" weight="bold">
        $ {integerPart}
      </Text>
      <Text size="sm" weight="bold">
        {decimalPart}
      </Text>
    </Flex>
  )
}

const Balance = () => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState<boolean>(false)
  return (
    <>
      <Text size="sm" color="mainText" weight="bold">
        Balance
      </Text>
      <Flex direction="row" align="center" justify="space-between">
        <FormattedBalance balance={accountBalance.totalInUSD} />
        {!!accountBalance.balanceByTokens.length && (
          <DownArrowIcon
            size={rem(10)}
            className={cx(classes.pointer, { [classes.rotateUpsideDown]: opened })}
            onClick={() => setOpened((prevState) => !prevState)}
          />
        )}
      </Flex>

      {opened && (
        <Flex direction="column">
          {accountBalance.balanceByTokens.map((item) => (
            <Flex justify="space-between" key={item.id} className={classes.secondaryColor}>
              <Flex align="center">
                <Image maw={15} mx="auto" radius="md" src={item.icon} alt={item.symbol} />
                <Text size="xs">
                  {formatCurrency(item.amount, DIGITS_AFTER_FLOATING_POINT)} {item.symbol}
                </Text>
              </Flex>
              <Text size="xs">on {item.network}</Text>
            </Flex>
          ))}
        </Flex>
      )}
    </>
  )
}

export default Balance
