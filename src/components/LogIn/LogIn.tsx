import useAccount from 'hooks/useAccount'
import { Grid, Button } from '@mantine/core'

function LogIn() {
  const { connectWallet, adexAccount } = useAccount()
  return (
    <Grid>
      <Grid.Col span={4}>SOme image and title here</Grid.Col>
      <Grid.Col span={2}>
        <Button onClick={connectWallet}>{`Test account conect ${adexAccount?.address}`}</Button>
      </Grid.Col>
    </Grid>
  )
}

export default LogIn
