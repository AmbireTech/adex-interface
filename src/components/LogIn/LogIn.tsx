import useAccount from 'hooks/useAccount'
import { Container, Grid, Button, Center } from '@mantine/core'

function LogIn() {
  const { connectWallet, adexAccount } = useAccount()
  return (
    <Container fluid h="100vh">
      <Grid grow h="100%" justify="stretch">
        <Grid.Col md={8} order={1} xs={12} orderXs={2} orderMd={1}>
          <Center h="100%">Some image and title here</Center>
        </Grid.Col>
        <Grid.Col md={4} order={2} xs={12} orderXs={1} orderMd={2}>
          <Center h="100%">
            <Button onClick={connectWallet}>{`Test account conect ${adexAccount?.address}`}</Button>
          </Center>
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default LogIn
