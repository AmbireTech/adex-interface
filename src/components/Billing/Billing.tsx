import { Grid, Popover, Text } from '@mantine/core'
// import { useViewportSize } from '@mantine/hooks'
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
  const [selectedTab, setSelectedTab] = useState<TabType>(TabType.BillingTab)
  const handleTabClicked = (value: TabType) => setSelectedTab(value)

  /* Temporary added, should be removed */
  const [openedStatements, setOpenedStatements] = useState(false)

  return (
    <Grid grow columns={10}>
      <Grid.Col sm={10} md={3} lg={2}>
        <Grid>
          <Grid.Col>
            <CustomCard
              width="100%"
              height={100}
              text="Billing details"
              iconLeft={<BillingDetailsIcon size="24px" />}
              color="secondary"
              active={selectedTab === TabType.BillingTab}
              action={() => handleTabClicked(TabType.BillingTab)}
              variant="shadow"
            />
          </Grid.Col>
          <Grid.Col>
            <CustomCard
              width="100%"
              height={100}
              text="Invoices"
              iconLeft={<InvoiceIcon size="24px" />}
              color="secondary"
              active={selectedTab === TabType.InvoicesTab}
              action={() => handleTabClicked(TabType.InvoicesTab)}
              variant="shadow"
            />
          </Grid.Col>
          <Grid.Col>
            {/* Temporary added popover, should be removed */}
            <Popover opened={openedStatements} onChange={setOpenedStatements} closeOnClickOutside>
              <Popover.Target>
                <div>
                  <CustomCard
                    width="100%"
                    height={100}
                    text="Account Statements"
                    iconLeft={<StatementsIcon size="24px" />}
                    color="secondary"
                    active={selectedTab === TabType.StatementsTab}
                    // action={() => handleTabClicked(TabType.StatementsTab)}
                    action={() => setOpenedStatements((o) => !o)}
                    variant="shadow"
                  />
                </div>
              </Popover.Target>
              <Popover.Dropdown>
                <Text>Coming Soon...</Text>
              </Popover.Dropdown>
            </Popover>
          </Grid.Col>
        </Grid>
      </Grid.Col>
      <Grid.Col sm={10} md={7} lg={4}>
        <TabSwitch selectedTab={selectedTab} />
      </Grid.Col>
      {/* Note: this column is an empty, we use it instead of margin */}
      <Grid.Col sm={0} md={0} lg={4} />
    </Grid>
  )
}

export default Billing
