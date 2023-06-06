import { Box, Container, Grid, Stack, createStyles } from '@mantine/core'
import { Link, Outlet } from 'react-router-dom'

const useStyles = createStyles((theme) => {
  return {
    container: {
      backgroundColor: theme.white,
      borderRadius: theme.radius.sm,
      boxShadow: theme.shadows.xs
    }
  }
})

function Billing() {
  const { classes } = useStyles()

  return (
    <Grid p="10px">
      <Grid.Col span="content">
        <Stack>
          <Box
            component={Link}
            w="300px"
            h="100px"
            style={{ border: '1px solid black' }}
            to="billing-details"
          >
            Billing details
          </Box>
          <Box
            component={Link}
            w="300px"
            h="100px"
            style={{ border: '1px solid black' }}
            to="invoices"
          >
            Invoices
          </Box>
          <Box
            component={Link}
            w="300px"
            h="100px"
            style={{ border: '1px solid black' }}
            to="statements"
          >
            Statements
          </Box>
        </Stack>
      </Grid.Col>
      <Grid.Col span={5}>
        <Container fluid h="70vh" className={classes.container}>
          <Outlet />
        </Container>
      </Grid.Col>
    </Grid>
  )
}

export default Billing
