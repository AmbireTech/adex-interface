import { Container, Grid, Stack, createStyles } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import useBasePath from 'hooks/useBasePath'
import { Link, Outlet, useResolvedPath } from 'react-router-dom'
import BillingDetailsIcon from 'resources/icons/BillingDetails'
import InvoiceIcon from 'resources/icons/Invoice'
import StatementsIcon from 'resources/icons/Statements'

const useStyles = createStyles((theme) => {
  return {
    container: {
      backgroundColor: theme.white,
      borderRadius: theme.radius.sm,
      boxShadow: theme.shadows.xs,
      overflow: 'hidden',
      padding: 20
    }
  }
})

function Billing() {
  const { classes } = useStyles()
  const basePath = useBasePath()

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
            active={useResolvedPath('billing-details').pathname === basePath}
          />
          <CustomCard
            width={300}
            height={100}
            text="Invoices"
            iconLeft={<InvoiceIcon size="24px" />}
            color="secondary"
            component={Link}
            to="invoices/1"
            active={useResolvedPath('invoices').pathname === basePath}
          />
          <CustomCard
            width={300}
            height={100}
            text="Account Statements"
            iconLeft={<StatementsIcon size="24px" />}
            color="secondary"
            component={Link}
            to="account-statements/1"
            active={useResolvedPath('account-statements').pathname === basePath}
          />
        </Stack>
      </Grid.Col>
      <Grid.Col span="content">
        <Container fluid h={730} w={600} miw={350} className={classes.container}>
          <Outlet />
        </Container>
      </Grid.Col>
    </Grid>
  )
}

export default Billing
