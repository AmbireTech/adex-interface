import { Container, Flex, Text } from '@mantine/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import CustomTable from 'components/common/CustomTable'
import { campaignPeriodParser } from 'utils'
import { campaignHeaders } from 'constant'
import { AdminCampaignModal } from 'components/common/Modals'
import BadgeStatusCampaign from 'components/Dashboard/BadgeStatusCampaign'
import { Campaign } from 'adex-common'
import { useAdExApi } from 'hooks/useAdexServices'

const AdminPanel = () => {
  const { adexServicesRequest } = useAdExApi()
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedItem, setSelectedItem] = useState<Campaign | null>(null)
  const [campaignData, setCampaignData] = useState<Campaign[] | null>(null)
  useEffect(() => {
    adexServicesRequest<Campaign[]>('backend', {
      route: '/dsp/admin/campaigns',
      queryParams: { all: 'true' }
    })
      .then(setCampaignData)
      .catch((err) => console.error(err))
  }, [opened]) // eslint-disable-line
  const elements = useMemo(
    () =>
      campaignData
        ? campaignData?.map((el: Campaign) => {
            return {
              id: el.id,
              title: el.title,
              model: el.type,
              status: <BadgeStatusCampaign type={el.status} />,
              served: 'No data',
              budget: 'No data',
              impressions: 'No data',
              clicks: 'No data',
              ctr: 'No data',
              period: campaignPeriodParser([el.activeFrom, el.activeTo])
            }
          })
        : [],
    [campaignData] // eslint-disable-line
  )

  const handlePreview = useCallback(
    (item: Campaign) => {
      setSelectedItem(campaignData?.filter((campaign) => campaign.id === item.id)[0] || null)
      open()
    },
    [open, campaignData]
  )

  const handleDelete = useCallback((item: Campaign) => {
    console.log('item', item)
  }, [])
  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Text size="sm" color="secondaryText" weight="bold" mb="md">
          All Campaigns
        </Text>
        <CustomTable
          background
          headings={campaignHeaders}
          elements={elements}
          onPreview={handlePreview}
          onDelete={handleDelete}
        />
      </Flex>
      <AdminCampaignModal item={selectedItem} opened={opened} close={close} />
    </Container>
  )
}

export default AdminPanel
