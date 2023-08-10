import { Container, Flex, Text, createStyles } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { BadgeType } from 'types'
import BadgeStatusCampaign from './BadgeStatusCampaign'
import { dashboardTableElements } from './mockData'

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.mainBackground[theme.fn.primaryShade()],
    borderRadius: theme.radius.sm,
    boxShadow: theme.shadows.xs,
    overflow: 'hidden',
    padding: theme.spacing.lg,
    margin: 0
  }
}))

const Dashboard = () => {
  const { classes } = useStyles()
  const headings = [
    'Campaign name',
    'Model',
    'Status',
    'Served',
    'Budget',
    'Impressions',
    'Clicks',
    'CTR',
    'Period'
  ]

  const elements = dashboardTableElements.map((el) => {
    return {
      ...el,
      status: <BadgeStatusCampaign type={el.status as BadgeType} />,
      impressions: el.impressions.toLocaleString(),
      clicks: el.clicks.toLocaleString()
    }
  })

  const handlePreview = (item: any) => {
    console.log('item', item)
  }

  const handleAnalytics = (item: any) => {
    console.log('item', item)
  }

  const handleDuplicate = (item: any) => {
    console.log('item', item)
  }

  const handleDelete = (item: any) => {
    console.log('item', item)
  }

  return (
    <Flex direction="column" justify="start">
      <Text size="sm" color="secondaryText" weight="bold">
        All Campaigns
      </Text>
      <Container fluid className={classes.container}>
        <CustomTable
          headings={headings}
          elements={elements}
          onPreview={handlePreview}
          onAnalytics={handleAnalytics}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </Container>
    </Flex>
  )
}

export default Dashboard
