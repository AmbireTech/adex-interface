import { InvoicesPDF } from 'components/Billing/BillingPDF'
import { ADEX_COMPANY_DETAILS } from 'constants/adexCompanyDetatils'
import useAccount from 'hooks/useAccount'
import useCampaignAnalytics from 'hooks/useCampaignAnalytics'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { useEffect, useMemo, useState } from 'react'
import { AnalyticsPeriod, BaseAnalyticsData, IInvoiceDetails } from 'types'
import { BillingDetailsModal } from './BillingDetailsModal'

type PrintModalProps = {
  campaignId: string
  opened: boolean
  close: () => void
}

export const InvoicesModal = ({ campaignId, opened, close }: PrintModalProps) => {
  const { campaignsData } = useCampaignsData()
  const {
    adexAccount: {
      billingDetails,
      address,
      refundsFromCampaigns: { perCampaign: refunds },
      fundsOnCampaigns: { perCampaign: openings }
    }
  } = useAccount()
  const { getAnalyticsKeyAndUpdate, mappedAnalytics } = useCampaignAnalytics()
  const [analyticsKey, setAnalyticsKey] = useState<
    | {
        key: string
        period: AnalyticsPeriod
      }
    | undefined
  >()

  const campaignData = useMemo(
    () => campaignsData.get(campaignId),

    [campaignId, campaignsData]
  )

  const campaign = useMemo(() => campaignData?.campaign, [campaignData])
  const currencyName = useMemo(
    () => (campaign?.id ? openings.find((item) => item.id === campaign?.id)?.token.name || '' : ''),
    [campaign?.id, openings]
  )

  const actualPeriod = useMemo(() => {
    const to = Number(campaign?.activeTo || 0)

    // NOTE: the actual payment is when the campaign is started (openings -> start dates, activeFrom is fallback)
    // The question is: Is that ok from accounting stand point
    // TODO: Should we have invoices for the full amount and credit notes for the refunds (on stop or expire with no full budget used)
    const start = new Date(
      openings.find((item) => item.id === campaign?.id)?.startDate ||
        Number(campaign?.activeFrom) ||
        0
    ).getTime()

    const end = new Date(
      refunds.find((item) => item.id === campaign?.id)?.closeDate || to
    ).getTime()

    // TODO: discuss the payment and invoice date
    return {
      invoiceDate: Math.min(end, to),
      paymentDate: start
    }
  }, [campaign?.activeFrom, campaign?.activeTo, campaign?.id, openings, refunds])

  const campaignMappedAnalytics: BaseAnalyticsData[] | undefined = useMemo(
    () => mappedAnalytics.get(analyticsKey?.key || ''),
    [analyticsKey, mappedAnalytics]
  )

  useEffect(() => {
    if (!campaign) return
    setAnalyticsKey(undefined)

    const checkAnalytics = async () => {
      try {
        const key = await getAnalyticsKeyAndUpdate(campaign, 'hostname')
        setAnalyticsKey(key)
      } catch (e) {
        console.error('Can not get Analytics key: ', e)
      }
    }

    checkAnalytics()
  }, [campaign, getAnalyticsKeyAndUpdate])

  const elements: IInvoiceDetails = useMemo(() => {
    return {
      invoiceId: campaign?.id || '',
      invoiceDate: new Date(actualPeriod.invoiceDate),
      paymentDate: new Date(actualPeriod.paymentDate),
      seller: ADEX_COMPANY_DETAILS,
      buyer: {
        ...billingDetails,
        ethAddress: address
      },
      invoiceData:
        campaignMappedAnalytics && campaignMappedAnalytics.length ? campaignMappedAnalytics : [],
      // TODO: Check if the value of VAT% should be greater than 0
      vatPercentageInUSD: 22,
      currencyName
    }
  }, [
    campaign?.id,
    actualPeriod.invoiceDate,
    actualPeriod.paymentDate,
    billingDetails,
    address,
    campaignMappedAnalytics,
    currencyName
  ])

  return (
    <BillingDetailsModal
      title="Invoice"
      loading={!analyticsKey || !campaignMappedAnalytics}
      opened={opened}
      close={close}
    >
      <InvoicesPDF
        invoiceDetails={elements}
        placement={campaign?.targetingInput.inputs.placements.in[0] || 'site'}
      />
    </BillingDetailsModal>
  )
}
