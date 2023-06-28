import { Container, Grid, Stack, createStyles } from '@mantine/core'
import CustomCard from 'components/common/CustomCard'
import { useState } from 'react'
import BillingDetailsIcon from 'resources/icons/BillingDetails'
import InvoiceIcon from 'resources/icons/Invoice'
import StatementsIcon from 'resources/icons/Statements'
import BillingDetails from './BillingDetails'
import Invoices from './Invoices'
import AccountStatements from './AccountStatements'

enum TabType {
  BillingTab,
  InvoicesTab,
  StatementsTab
}

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

const TabSwitch = ({ selectedTab }: { selectedTab: TabType }) => {
  switch (selectedTab) {
    case TabType.BillingTab:
      return <BillingDetails />
    case TabType.InvoicesTab:
      return <Invoices />
    case TabType.StatementsTab:
      return <AccountStatements />
    default:
      return <BillingDetails />
  }
}

function Billing() {
  const { classes } = useStyles()
  const [selectedTab, setSelectedTab] = useState<TabType>(TabType.BillingTab)
  const handleTabClicked = (value: TabType) => setSelectedTab(value)

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
            active={selectedTab === TabType.BillingTab}
            action={() => handleTabClicked(TabType.BillingTab)}
          />
          <CustomCard
            width={300}
            height={100}
            text="Invoices"
            iconLeft={<InvoiceIcon size="24px" />}
            color="secondary"
            active={selectedTab === TabType.InvoicesTab}
            action={() => handleTabClicked(TabType.InvoicesTab)}
          />
          <CustomCard
            width={300}
            height={100}
            text="Account Statements"
            iconLeft={<StatementsIcon size="24px" />}
            color="secondary"
            active={selectedTab === TabType.StatementsTab}
            action={() => handleTabClicked(TabType.StatementsTab)}
          />
        </Stack>
      </Grid.Col>
      <Grid.Col span="content">
        <Container fluid h={730} w={600} miw={350} className={classes.container}>
          <TabSwitch selectedTab={selectedTab} />
        </Container>
      </Grid.Col>
    </Grid>
  )
}

export default Billing
