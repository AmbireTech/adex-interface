import { Flex, Text } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'

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
const elements = [
  {
    campaignName: 'Campaign Name Long',
    model: 'CPM',
    status: 'Draft',
    served: '100%',
    budget: '3000.00 DAI',
    impressions: 999999999,
    clicks: 999999,
    ctr: 0.5,
    period: {
      from: '08.02.23',
      to: '08.03.23'
    }
  }
]

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

const Dashboard = () => {
  return (
    <Flex justify="start">
      <Text size="sm" color="secondaryText" weight="bold">
        All Campaigns
      </Text>
      <CustomTable
        headings={headings}
        elements={elements}
        onPreview={handlePreview}
        onAnalytics={handleAnalytics}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />
    </Flex>
  )
}

export default Dashboard
