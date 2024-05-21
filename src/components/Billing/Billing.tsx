import { Grid, MantineColor, Popover, Text } from '@mantine/core'
// import { useViewportSize } from '@mantine/hooks'
import { CustomCardType } from 'types'
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

type CustomCardCommonProps = {
  color: MantineColor
  width: number | string
  height: number | string
  variant?: CustomCardType
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

const CARD_COMMON_PROPS: CustomCardCommonProps = {
  width: '100%',
  height: 100,
  color: 'secondary',
  variant: 'shadow'
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
              text="Billing details"
              iconLeft={<BillingDetailsIcon size="24px" />}
              active={selectedTab === TabType.BillingTab}
              action={() => handleTabClicked(TabType.BillingTab)}
              {...CARD_COMMON_PROPS}
            />
          </Grid.Col>
          <Grid.Col>
            <CustomCard
              text="Invoices"
              iconLeft={<InvoiceIcon size="24px" />}
              active={selectedTab === TabType.InvoicesTab}
              action={() => handleTabClicked(TabType.InvoicesTab)}
              {...CARD_COMMON_PROPS}
            />
          </Grid.Col>
          <Grid.Col>
            {/* Temporary added popover, should be removed */}
            <Popover opened={openedStatements} onChange={setOpenedStatements} closeOnClickOutside>
              <Popover.Target>
                <div>
                  <CustomCard
                    text="Account Statements"
                    iconLeft={<StatementsIcon size="24px" />}
                    active={selectedTab === TabType.StatementsTab}
                    // action={() => handleTabClicked(TabType.StatementsTab)}
                    action={() => setOpenedStatements((o) => !o)}
                    {...CARD_COMMON_PROPS}
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
