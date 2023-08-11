import { Container, Flex, Text } from '@mantine/core'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import CustomTable from 'components/common/CustomTable'
import { BadgeType, ICampaignData } from 'types'
import { CampaignDetailsModal } from 'components/common/Modals'
import BadgeStatusCampaign from './BadgeStatusCampaign'
import { dashboardTableElements } from './mockData'

const Dashboard = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedItem, setSelectedItem] = useState<ICampaignData | null>(null)
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
    setSelectedItem(item)
    open()
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
      <CampaignDetailsModal item={selectedItem} opened={opened} close={close} />
    </Container>
  )
}

export default Dashboard
