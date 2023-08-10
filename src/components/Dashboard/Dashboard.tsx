import { Container, Flex, Text } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { BadgeType } from 'types'
import BadgeStatusCampaign from './BadgeStatusCampaign'
import { dashboardTableElements } from './mockData'

const Dashboard = () => {
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
    <Container fluid>
      <Flex direction="column" justify="start">
        <Text size="sm" color="secondaryText" weight="bold" mb="md">
          All Campaigns
        </Text>
        <CustomTable
          background
          headings={headings}
          elements={elements}
          onPreview={handlePreview}
          onAnalytics={handleAnalytics}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </Flex>
    </Container>
  )
}

export default Dashboard
