import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useMemo, useState } from 'react'
import { CampaignStatus } from 'adex-common'
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
      billingDetails: { companyName }
    }
  } = useAccount()

  const [selectedCampaignId, setSelectedCampaignId] = useState('')

  const invoiceElements = useMemo(
    () =>
      campaigns
        .filter((c) =>
          [CampaignStatus.expired, CampaignStatus.closedByUser, CampaignStatus.exhausted].includes(
            c.campaign.status
          )
        )
        .sort((a, b) => Number(b.campaign.activeFrom) - Number(a.campaign.activeFrom))
        .map((campaign) => {
          return {
            id: campaign.campaignId,
            companyName,
            campaignPeriod: (
              <span>
                <span>{formatDateShort(new Date(Number(campaign.campaign.activeFrom)))} </span>
                <br />
                <span>{formatDateShort(new Date(Number(campaign.campaign.activeTo)))} </span>
              </span>
            )
          }
        }),
    [campaigns, companyName]
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
