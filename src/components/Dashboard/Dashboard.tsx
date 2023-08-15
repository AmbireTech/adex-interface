import { Container, Flex, Text } from '@mantine/core'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import CustomTable from 'components/common/CustomTable'
import { BadgeType, ICampaignData } from 'types'
import { CampaignDetailsModal } from 'components/common/Modals'
import { useNavigate } from 'react-router-dom'
import BadgeStatusCampaign from './BadgeStatusCampaign'
import { dashboardTableElements } from './mockData'

const Dashboard = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedItem, setSelectedItem] = useState<ICampaignData | null>(null)
  const navigate = useNavigate()
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
      id: el.id,
      campaignName: el.campaignName,
      model: el.model,
      status: <BadgeStatusCampaign type={el.status as BadgeType} />,
      served: el.served,
      budget: el.budget,
      impressions: el.impressions.toLocaleString(),
      clicks: el.clicks.toLocaleString(),
      ctr: el.ctr,
      period: el.period
    }
  })

  const handlePreview = (item: ICampaignData) => {
    setSelectedItem(item)
    open()
  }

  const handleAnalytics = (item: ICampaignData) => {
    navigate(`/dashboard/campaign-analytics/${item.id}`)
  }

  const handleDuplicate = (item: ICampaignData) => {
    console.log('item', item)
  }

  const handleDelete = (item: ICampaignData) => {
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
