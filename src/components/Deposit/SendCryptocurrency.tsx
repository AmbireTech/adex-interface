import { ActionIcon, Alert, CopyButton, Text, Grid, Group } from '@mantine/core'
import useAccount from 'hooks/useAccount'
import CopyIcon from 'resources/icons/Copy'
import InfoIcon from 'resources/icons/Info'
import { QRCodeSVG } from 'qrcode.react'
import { createStyles } from '@mantine/emotion'

const useStyles = createStyles((theme) => ({
  center: {
    display: 'flex',
    justifyContent: 'center'
  },
  qrCodeWrapper: {
    display: 'flex',
    border: '15px solid',
    padding: theme.spacing.sm,
    borderColor: theme.colors.lightBackground[3],
    borderRadius: theme.radius.md
  },
  addressWrapper: {
    backgroundColor: theme.colors.lightBackground[3],
    padding: theme.spacing.xs,
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[3],
    borderRadius: theme.radius.md
  }
}))

const SendCryptocurrency = () => {
  const { classes } = useStyles()
  const { adexAccount } = useAccount()
  const accountAddress = adexAccount.address

  return (
    <Grid gutter="xl" align="center">
      <Grid.Col>
        <Alert icon={<InfoIcon />} color="attention" variant="outline">
          AdEx operates only with ADX, USDC, USDT or DAI. Please make sure you deposit only these
          coins.
        </Alert>
      </Grid.Col>
      <Grid.Col>
        <Text size="sm" mb="xs" color="brand">
          Min. campaign budget: $200
        </Text>
        <Group justify="apart" className={classes.addressWrapper}>
          <Text>{accountAddress}</Text>
          <CopyButton value={accountAddress} timeout={2000}>
            {({ copied, copy }) => (
              // TODO: fix the color of the copy icon
              <ActionIcon color={copied ? 'teal' : 'brand'} onClick={copy}>
                <CopyIcon size="1rem" />
              </ActionIcon>
            )}
          </CopyButton>
        </Group>
      </Grid.Col>
      <Grid.Col className={classes.center}>
        <div className={classes.qrCodeWrapper}>
          <QRCodeSVG value={accountAddress} />
        </div>
      </Grid.Col>
    </Grid>
  )
}

export default SendCryptocurrency
