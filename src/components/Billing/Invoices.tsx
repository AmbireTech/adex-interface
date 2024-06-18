import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useMemo, useState } from 'react'

import { useCampaignsData } from 'hooks/useCampaignsData'
// TODO: Delete mock data
// import { invoiceElements } from './mockedData'
import useAccount from 'hooks/useAccount'
import { formatDateShort } from 'helpers'
import { InvoicesModal } from './InvoicesModal'

const columnTitles = ['Company Name', 'Campaign Period']

const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { campaignsData } = useCampaignsData()
  const campaigns = useMemo(() => Array.from(campaignsData.values()), [campaignsData])
  const {
    adexAccount: {
      billingDetails: { companyName },
      fundsOnCampaigns: { perCampaign: fundsOnPerCampaign },
      refundsFromCampaigns: { perCampaign: refundsFromPerCampaign }
    }
  } = useAccount()

  const [selectedCampaignId, setSelectedCampaignId] = useState('')

  const invoiceElements = useMemo(
    () =>
      campaigns
        .filter((c) => refundsFromPerCampaign.find((item) => item.id === c.campaign?.id))
        .map((campaign) => {
          const campaignStartDate = fundsOnPerCampaign.find(
            (item) => item.id === campaign.campaign?.id
          )?.startDate

          const campaignCloseDate = refundsFromPerCampaign.find(
            (item) => item.id === campaign.campaign?.id
          )?.closeDate

          return {
            id: campaign.campaignId,
            companyName,
            campaignPeriod: (
              <span>
                <span>
                  {campaignStartDate ? formatDateShort(new Date(campaignStartDate)) : 'N/A'}
                </span>
                <br />
                <span>
                  {campaignCloseDate ? formatDateShort(new Date(campaignCloseDate)) : 'N/A'}
                </span>
              </span>
            )
          }
        }),
    [campaigns, companyName, refundsFromPerCampaign, fundsOnPerCampaign]
  )

  const handlePreview = useCallback(
    (item: any) => {
      setSelectedCampaignId(item.id)
      open()
    },
    [open]
  )

  return invoiceElements && invoiceElements.length ? (
    <>
      <CustomTable
        background
        headings={columnTitles}
        elements={invoiceElements}
        onPreview={handlePreview}
      />
      <InvoicesModal campaignId={selectedCampaignId} opened={opened} close={close} />
    </>
  ) : (
    // TODO: needs to be style
    <Title order={4}>No invoices found.</Title>
  )
}

export default Invoices
