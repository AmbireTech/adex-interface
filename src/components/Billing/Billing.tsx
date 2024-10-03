import { Container, Grid, Stack } from '@mantine/core'
import { ICustomCardProps } from 'types'
import CustomCard from 'components/common/CustomCard'
import { useState } from 'react'
import BillingDetailsIcon from 'resources/icons/BillingDetails'
import InvoiceIcon from 'resources/icons/Invoice'
import StatementsIcon from 'resources/icons/Statements'
import useAccount from 'hooks/useAccount'
import CalendarIcon from 'resources/icons/Calendar'
import BillingDetails from './BillingDetails'
import Invoices from './Invoices'
import Statements from './AccountStatements'
import AccountActivity from './AccountActivity'

enum TabType {
  BillingTab,
  InvoicesTab,
  StatementsTab,
  ActivityTab
}

const TabSwitch = ({ selectedTab }: { selectedTab: TabType }) => {
  switch (selectedTab) {
    case TabType.BillingTab:
      return <BillingDetails />
    case TabType.InvoicesTab:
      return <Invoices />
    case TabType.StatementsTab:
      return <Statements />
    case TabType.ActivityTab:
      return <AccountActivity />
    default:
      return <BillingDetails />
  }
}

const BillingCard = (props: Omit<ICustomCardProps, 'width' | 'height' | 'color' | 'variant'>) => (
  <CustomCard
    {...props}
    component="button"
    width="100%"
    height={100}
    color="secondary"
    variant="shadow"
  />
)

function Billing() {
  const {
    adexAccount: {
      billingDetails: { verified }
    }
  } = useAccount()

  const [selectedTab, setSelectedTab] = useState<TabType>(TabType.BillingTab)
  const handleTabClicked = (value: TabType) => setSelectedTab(value)

  return (
    <Container size="xl">
      <Grid columns={12} gutter="xl">
        <Grid.Col span={{ sm: 12, md: 4, lg: 4 }}>
          <Stack gap="md">
            <BillingCard
              text="Billing details"
              iconLeft={<BillingDetailsIcon size="24px" />}
              active={selectedTab === TabType.BillingTab}
              action={() => handleTabClicked(TabType.BillingTab)}
            />

            <BillingCard
              text="Invoices"
              iconLeft={<InvoiceIcon size="24px" />}
              active={selectedTab === TabType.InvoicesTab}
              action={() => handleTabClicked(TabType.InvoicesTab)}
              disabled={!verified}
            />
            <BillingCard
              text="Account Statements"
              iconLeft={<StatementsIcon size="24px" />}
              active={selectedTab === TabType.StatementsTab}
              action={() => handleTabClicked(TabType.StatementsTab)}
              disabled={!verified}
            />
            <BillingCard
              text="Account Activity"
              iconLeft={<CalendarIcon size="24px" />}
              active={selectedTab === TabType.ActivityTab}
              action={() => handleTabClicked(TabType.ActivityTab)}
            />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ sm: 12, md: 8, lg: 8 }}>
          <TabSwitch selectedTab={selectedTab} />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Billing
