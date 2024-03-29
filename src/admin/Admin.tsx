import { Container, Flex, Text } from '@mantine/core'
import { useCallback, useMemo, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { useApi } from 'lib/api'
import CustomTable from 'components/common/CustomTable'
import { campaignPeriodParser } from 'utils'
import { campaignHeaders } from 'constant'
import { AdminCampaignModal } from 'components/common/Modals'
import BadgeStatusCampaign from 'components/Dashboard/BadgeStatusCampaign'
import { Campaign } from 'adex-common'

const AdminPanel = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const [selectedItem, setSelectedItem] = useState<Campaign | null>(null)
  const [campaignData, isResolved, error] = useApi<Campaign[]>({
    // we can also make an independent file handling all the endpoints and calling a function
    // ex. const [selectedItem, setSelectedItem] = getCampaignsByOwner() and hold all the requests there
    // in case of endpoint change we can modify only in one place and affect all dependent files
    endpoint: '/dsp/admin/campaigns',
    // add pagination
    queryParams: { all: 'true' }
  })

  const elements = useMemo(
    () =>
      campaignData && !error
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
      setSelectedItem(item)
      open()
    },
    [open]
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
        {!isResolved && 'Loading'}
        {error ? (
          'Error getting data'
        ) : (
          <CustomTable
            background
            headings={campaignHeaders}
            elements={elements}
            onPreview={handlePreview}
            onDelete={handleDelete}
          />
        )}
      </Flex>
      <AdminCampaignModal item={selectedItem} opened={opened} close={close} />
    </Container>
  )
}

export default AdminPanel
