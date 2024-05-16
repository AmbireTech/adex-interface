import { Title } from '@mantine/core'
import CustomTable from 'components/common/CustomTable'
import { PrintModal } from 'components/common/Modals'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useMemo, useState } from 'react'

import useCampaignsData from 'hooks/useCampaignsData'
// TODO: Delete mock data
// import { invoiceElements } from './mockedData'
import { CampaignFundsActive, IInvoices } from 'types'
import { CampaignStatus } from 'adex-common'
import useAccount from 'hooks/useAccount'
import { formatDateShort } from 'helpers'

const columnTitles = ['Company Name', 'Campaign Period', 'Amount Spent']

const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { campaignsData } = useCampaignsData()
  const campaigns = useMemo(() => Array.from(campaignsData.values()), [campaignsData])
  const {
    adexAccount: {
      billingDetails: { companyName },
      fundsOnCampaigns: { perCampaign }
    }
  } = useAccount()

  const [selectedCampaignId, setSelectedCampaignId] = useState('')

  const getCurrencyName = useCallback(
    (campaignId: string, campaings: CampaignFundsActive[]) =>
      campaignId && !!campaings.length
        ? campaings.find((item) => item.id === campaignId)?.token.name || ''
        : '',

    []
  )

  const isCampaignEnded = useCallback(
    (campaignStatus: CampaignStatus) =>
      [CampaignStatus.expired, CampaignStatus.closedByUser, CampaignStatus.exhausted].includes(
        campaignStatus
      ),
    []
  )

  const invoiceElements: IInvoices[] = useMemo(
    () =>
      campaigns
        .filter((c) => isCampaignEnded(c.campaign.status))
        .map((campaign) => ({
          id: campaign.campaignId,
          companyName,
          campaignPeriod: {
            from: formatDateShort(new Date(Number(campaign.campaign.activeFrom))),
            to: formatDateShort(new Date(Number(campaign.campaign.activeTo)))
          },
          amountSpent: `${campaign.paid} ${getCurrencyName(campaign.campaignId, perCampaign)} `
        })),
    [campaigns, companyName, getCurrencyName, perCampaign, isCampaignEnded]
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
      <CustomTable headings={columnTitles} elements={invoiceElements} onPreview={handlePreview} />
      <PrintModal campaignId={selectedCampaignId} opened={opened} close={close} />
    </>
  ) : (
    // TODO: needs to be style
    <Title order={4}>No invoices found.</Title>
  )
}

export default Invoices
