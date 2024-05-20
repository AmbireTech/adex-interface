import { Container, Flex, Grid, Popover, Stack, Text, createStyles, rem } from '@mantine/core'
import { useMediaQuery, useViewportSize } from '@mantine/hooks'
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

const useStyles = createStyles((theme, { windowWidth }: { windowWidth: number }) => {
  return {
    container: {
      overflow: 'hidden',
      padding: theme.spacing.xs,
      width: rem(windowWidth * 0.4)
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
  const isMobile = useMediaQuery('(max-width: 75rem)')
  const { width: windowWidth } = useViewportSize()
  const { classes } = useStyles({ windowWidth })
  const [selectedTab, setSelectedTab] = useState<TabType>(TabType.BillingTab)
  const handleTabClicked = (value: TabType) => setSelectedTab(value)

  /* Temporary added, should be removed */
  const [openedStatements, setOpenedStatements] = useState(false)

  return (
    <Flex gap="xl" direction={isMobile ? 'column' : 'row'}>
      <Stack w={isMobile ? '100%' : '300px'}>
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
      </Stack>
      <Grid>
        <Container className={classes.container}>
          <TabSwitch selectedTab={selectedTab} />
        </Container>
      </Grid>
    </Flex>
  )
}

export default Billing
