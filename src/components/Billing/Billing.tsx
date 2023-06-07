import { Container, Grid, Stack, createStyles } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import { Link, Outlet, useLocation, useMatch, useResolvedPath } from 'react-router-dom'
import BillingDetailsIcon from 'resources/icons/BillingDetails'
import InvoiceIcon from 'resources/icons/Invoice'
import StatementsIcon from 'resources/icons/Statements'

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
  const location = useLocation()
  const match = useMatch(location.pathname)

  return (
    <Grid>
      <Grid.Col span="content">
        <Stack>
          <CustomCard
            width={300}
            height={100}
            text="Billing details"
            iconLeft={<BillingDetailsIcon size="24px" />}
            color="secondary"
            component={Link}
            to="billing-details"
            active={useResolvedPath('billing-details').pathname === match?.pathname}
          />
          <CustomCard
            width={300}
            height={100}
            text="Invoices"
            iconLeft={<InvoiceIcon size="24px" />}
            color="secondary"
            component={Link}
            to="invoices"
            active={useResolvedPath('invoices').pathname === match?.pathname}
          />
          <CustomCard
            width={300}
            height={100}
            text="Account Statements"
            iconLeft={<StatementsIcon size="24px" />}
            color="secondary"
            component={Link}
            to="account-statements"
            active={useResolvedPath('account-statements').pathname === match?.pathname}
          />
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
