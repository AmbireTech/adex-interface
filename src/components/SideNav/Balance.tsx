import { Flex, createStyles, rem, Image, Text } from '@mantine/core'
import { useState } from 'react'
import DownArrowIcon from 'resources/icons/DownArrow'
import ethLogo from 'resources/logos/ethereumIcon.png'

const useStyles = createStyles((theme) => ({
  rotateUpsideDown: {
    transform: 'rotate(180deg)'
  },
  menu: {
    cursor: 'pointer'
  },
  balanceWrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: theme.fontSizes.xs
  }
}))

const FormattedBalance = ({ balance }: { balance: number }) => {
  const splitByDecimal = balance.toLocaleString().split('.')
  if (!splitByDecimal[1]) splitByDecimal[1] = '00'
  return (
    <Flex direction="row" align="baseline" justify="flex-start">
      <Text size="lg" weight="bold">
        $ {splitByDecimal[0]}
      </Text>
      <Text size="sm" weight="bold">
        .{splitByDecimal[1]}
      </Text>
    </Flex>
  )
}

const Balance = () => {
  const { classes, cx } = useStyles()
  const [opened, setOpened] = useState<boolean>(false)
  return (
    <>
      <Text size="sm" color="secondaryText" weight="bold">
        Balance
      </Text>
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        className={classes.menu}
        onClick={() => setOpened((prevState) => !prevState)}
      >
        <FormattedBalance balance={42000.69} />
        <DownArrowIcon size={rem(10)} className={cx({ [classes.rotateUpsideDown]: opened })} />
      </Flex>

      {opened && (
        <Flex direction="column">
          <div className={classes.balanceWrapper}>
            <Flex align="center">
              <Image maw={15} mx="auto" radius="md" src={ethLogo} alt="eth" />
              10,999.00 ADX
            </Flex>
            <div>on Ethereum</div>
          </div>
          <div className={classes.balanceWrapper}>
            <Flex align="center">
              <Image maw={15} mx="auto" radius="md" src={ethLogo} alt="eth" />
              10,999.00 ADX
            </Flex>
            <div>on Ethereum</div>
          </div>
          <div className={classes.balanceWrapper}>
            <Flex align="center">
              <Image maw={15} mx="auto" radius="md" src={ethLogo} alt="eth" />
              10,999.00 ADX
            </Flex>
            <div>on Ethereum</div>
          </div>
        </Flex>
      )}
    </>
  )
}

export default Balance
