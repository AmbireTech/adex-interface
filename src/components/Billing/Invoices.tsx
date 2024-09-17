import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CampaignStatus } from 'adex-common'
import { useCampaignsData } from 'hooks/useCampaignsData'
import useAccount from 'hooks/useAccount'
import { formatDateShort } from 'helpers'
import VisibilityIcon from 'resources/icons/Visibility'
import { InvoicesModal } from './InvoicesModal'

const columnTitles = ['Company Name', 'Campaign', 'Campaign Period']

const Invoices = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const { campaignsData, updateAllCampaignsData, initialDataLoading } = useCampaignsData()
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
        .filter(
          (c) =>
            [
              CampaignStatus.expired,
              CampaignStatus.closedByUser,
              CampaignStatus.exhausted
            ].includes(c.campaign.status) && c.paid > 0
        )
        .sort((a, b) => Number(b.campaign.activeFrom) - Number(a.campaign.activeFrom))
        .map((campaign) => {
          return {
            id: campaign.campaignId,
            columns: [
              { value: companyName },
              { value: campaign.campaign.title },
              {
                value: campaign.campaign.activeFrom,
                element: (
                  <span>
                    <span>{formatDateShort(new Date(Number(campaign.campaign.activeFrom)))} </span>
                    <br />
                    <span>{formatDateShort(new Date(Number(campaign.campaign.activeTo)))} </span>
                  </span>
                )
              }
            ]
          }
        }),
    [campaigns, companyName]
  )

  useEffect(() => {
    updateAllCampaignsData(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePreview = useCallback(
    (item: { id: string }) => {
      setSelectedCampaignId(item.id)
      open()
    },
    [open]
  )

  const actions = useMemo(() => {
    return [
      {
        action: handlePreview,
        label: 'Show campaign details',
        icon: <VisibilityIcon />
      }
    ]
  }, [handlePreview])

  return (
    <>
      <CustomTable
        headings={columnTitles}
        data={invoiceElements}
        actions={actions}
        shadow="xs"
        loading={initialDataLoading}
      />
      <InvoicesModal campaignId={selectedCampaignId} opened={opened} close={close} />
    </>
  )
}

export default Invoices
