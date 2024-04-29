import { Campaign, CampaignType, EventType } from 'adex-common'
import { Container, Flex, Text } from '@mantine/core'
import { useCallback, useMemo } from 'react'
import CustomTable from 'components/common/CustomTable'
import { periodNumberToDate } from 'helpers'
import { useNavigate } from 'react-router-dom'
import useCampaignsData from 'hooks/useCampaignsData'
import { parseBigNumTokenAmountToDecimal } from 'helpers/balances'
import BadgeStatusCampaign from './BadgeStatusCampaign'

const campaignHeaders = [
  'Name',
  'Model',
  'Placement',
  'Status',
  'Served %',
  'Budget',
  'Impressions',
  'Clicks',
  'CTR %',
  'Period',
  'CPM',
  'Average CPM'
]

const Dashboard = () => {
  const navigate = useNavigate()
  const { campaignsData } = useCampaignsData()
  // Temporary disabled show/hide archived until no functionality implemented
  // const [showArchived, setShowArchived] = useState(false)
  const filteredCampaignData = useMemo(() => {
    // if (!showArchived) {
    //   // TODO: change 'CampaignStatus.expired' to 'CampaignStatus.archived' when has been added to the model
    //   return campaignsData && Array.from(campaignsData.values()).length > 0
    //     ? Array.from(campaignsData.values()).filter(
    //         (campaign) => campaign.campaign.status !== CampaignStatus.expired
    //       )
    //     : []
    // }
    return Array.from(campaignsData.values())
  }, [campaignsData])

  const elements = useMemo(
    () =>
      filteredCampaignData.length
        ? filteredCampaignData.map((cmpData) => {
            const decimals = cmpData.campaign.outpaceAssetDecimals
            const budget = parseBigNumTokenAmountToDecimal(
              cmpData.campaign.campaignBudget,
              decimals
            )

            return {
              id: cmpData.campaignId,
              title: cmpData.campaign.title,
              type: CampaignType[cmpData.campaign.type],
              placement: cmpData.campaign.targetingInput.inputs.placements.in[0] || '-',
              status: <BadgeStatusCampaign type={cmpData.campaign.status} />,
              served: `${((cmpData.paid / budget) * 100).toFixed(4)}`,
              // TODO: get token name
              budget: `${budget} USDC`,
              impressions: cmpData.impressions,
              clicks: cmpData.clicks,
              ctr: `${cmpData.ctr}`,
              period: (
                <span>
                  <span>{periodNumberToDate(cmpData.campaign.activeFrom)} </span>
                  <br />
                  <span>{periodNumberToDate(cmpData.campaign.activeTo)} </span>
                </span>
              ),
              cpm: (
                <span>
                  <span>
                    {(
                      parseBigNumTokenAmountToDecimal(
                        cmpData.campaign.pricingBounds[EventType.IMPRESSION]?.min || 0n,
                        decimals
                      ) * 1000
                    ).toFixed(2)}
                  </span>
                  <br />

                  <span>
                    {(
                      parseBigNumTokenAmountToDecimal(
                        cmpData.campaign.pricingBounds[EventType.IMPRESSION]?.max || 0n,
                        decimals
                      ) * 1000
                    ).toFixed(2)}
                  </span>
                  <br />
                </span>
              ),
              avgCpm:
                typeof cmpData.avgCpm === 'number'
                  ? Number(cmpData.avgCpm).toFixed(2)
                  : cmpData.avgCpm
            }
          })
        : [],
    [filteredCampaignData]
  )

  const handlePreview = useCallback(
    (item: Campaign) => {
      navigate(`/dashboard/campaign-details/${item.id}`)
    },
    [navigate]
  )

  const handleAnalytics = useCallback(
    (item: Campaign) => {
      navigate(`/dashboard/campaign-analytics/${item.id}`)
    },
    [navigate]
  )

  // const handleDuplicate = useCallback((item: Campaign) => {
  //   // TODO: Implement duplication logic
  //   console.log('item', item)
  // }, [])

  // const handleDelete = useCallback((item: Campaign) => {
  //   // TODO: Implement deletion logic
  //   console.log('item', item)
  // }, [])

  // const toggleShowArchived = useCallback(() => {
  //   setShowArchived((prevShowArchived) => !prevShowArchived)
  // }, [])

  // useEffect(() => {
  //   if (filteredCampaignData.length === 0) {
  //     navigate('/dashboard/get-started', { replace: true })
  //   }
  // }, [navigate, filteredCampaignData.length])

  return (
    <Container fluid>
      <Flex direction="column" justify="start">
        <Flex justify="space-between" align="center">
          <Text size="sm" color="secondaryText" weight="bold" mb="md">
            All Campaigns
          </Text>
          {/* Temporary disabled show/hide archived until no functionality implemented */}
          {/* <UnstyledButton onClick={toggleShowArchived}>
            <Text size="sm" underline color="secondaryText">
              {showArchived ? 'Hide Archived' : 'Show Archived'}
            </Text>
          </UnstyledButton> */}
        </Flex>
        <CustomTable
          background
          headings={campaignHeaders}
          elements={elements}
          onPreview={handlePreview}
          onAnalytics={handleAnalytics}
          // Temporary disabled until no functionality implemented
          // onDuplicate={handleDuplicate}
          // onDelete={handleDelete}
        />
      </Flex>
    </Container>
  )
}

export default Dashboard
