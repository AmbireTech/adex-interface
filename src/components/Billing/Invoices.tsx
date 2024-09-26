import CustomTable from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CampaignStatus } from 'adex-common'
import { useCampaignsData } from 'hooks/useCampaignsData'
import useAccount from 'hooks/useAccount'
import { formatDateShort, parseBigNumTokenAmountToDecimal } from 'helpers'
import VisibilityIcon from 'resources/icons/Visibility'
import useAdmin from 'hooks/useAdmin'
import { InvoicesModal } from './InvoicesModal'

const columnTitles = ['Company Name', 'Campaign', 'Campaign Period']

const Invoices = ({ forAdmin }: { forAdmin?: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { campaignsData, updateAllCampaignsData } = useCampaignsData()
  const campaigns = useMemo(() => Array.from(campaignsData.values()), [campaignsData])
  const { accounts, initialDataLoading, getAllAccounts } = useAdmin()
  const { adexAccount } = useAccount()

  const [selectedCampaignId, setSelectedCampaignId] = useState('')
  const campaignData = useMemo(
    () => campaignsData.get(selectedCampaignId),

    [selectedCampaignId, campaignsData]
  )

  const selectedCampaignData = useMemo(() => campaignData, [campaignData])
  const selectedCampaign = useMemo(() => campaignData?.campaign, [campaignData?.campaign])

  const account = useMemo(
    () => (forAdmin ? accounts.get(selectedCampaign?.owner || '') || adexAccount : adexAccount),
    [accounts, adexAccount, selectedCampaign?.owner, forAdmin]
  )

  const invoiceData = useMemo(() => {
    const to = Number(selectedCampaign?.activeTo || 0)

    const campaignOpenData = account.fundsOnCampaigns.perCampaign.find(
      (item) => item.id === selectedCampaign?.id
    )
    const campaignCloseData = account.refundsFromCampaigns.perCampaign.find(
      (item) => item.id === selectedCampaign?.id
    )
    const currencyName = campaignOpenData?.token.name || ''
    const decimals = campaignOpenData?.token.decimals || 6

    // NOTE: the actual payment is when the campaign is started (openings -> start dates, activeFrom is fallback)
    // The question is: Is that ok from accounting stand point
    // TODO: Should we have invoices for the full amount and credit notes for the refunds (on stop or expire with no full budget used)
    const start = new Date(
      campaignOpenData?.startDate || Number(selectedCampaign?.activeFrom) || 0
    ).getTime()

    const end = new Date(campaignCloseData?.closeDate || to).getTime()

    // TODO: discuss the payment and invoice date

    const amount = parseBigNumTokenAmountToDecimal(
      BigInt(campaignOpenData?.amount || selectedCampaign?.campaignBudget || 0) -
        BigInt(campaignCloseData?.amount || 0),
      decimals
    )
    return {
      invoiceDate: Math.min(end, to),
      paymentDate: start,
      amount,
      currencyName
    }
  }, [
    account.fundsOnCampaigns.perCampaign,
    account.refundsFromCampaigns.perCampaign,
    selectedCampaign?.activeFrom,
    selectedCampaign?.activeTo,
    selectedCampaign?.campaignBudget,
    selectedCampaign?.id
  ])

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
              {
                value: forAdmin
                  ? accounts.get(campaign.campaign.owner)?.billingDetails?.companyName
                  : adexAccount.billingDetails.companyName
              },
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
    [accounts, adexAccount.billingDetails.companyName, campaigns, forAdmin]
  )

  useEffect(() => {
    updateAllCampaignsData(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getAllAccounts()
  }, [getAllAccounts])

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
        defaultSortIndex={2}
        shadow="xs"
        loading={initialDataLoading}
      />
      <InvoicesModal
        campaignData={selectedCampaignData}
        opened={opened}
        invoiceData={invoiceData}
        account={account}
        close={close}
      />
    </>
  )
}

export default Invoices
