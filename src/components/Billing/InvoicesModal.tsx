import { InvoicesPDF } from 'components/Billing/BillingPDF'
import { ADEX_COMPANY_DETAILS } from 'constants/adexCompanyDetatils'
import useAccount from 'hooks/useAccount'
import { useCampaignsData } from 'hooks/useCampaignsData'
import { useMemo } from 'react'
import { IInvoiceDetails } from 'types'
import { parseBigNumTokenAmountToDecimal } from 'helpers'
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

  const campaignData = useMemo(
    () => campaignsData.get(campaignId),

    [campaignId, campaignsData]
  )

  const campaign = useMemo(() => campaignData?.campaign, [campaignData])

  const invoiceData = useMemo(() => {
    const to = Number(campaign?.activeTo || 0)

    const campaignOpenData = openings.find((item) => item.id === campaign?.id)
    const campaignCloseData = refunds.find((item) => item.id === campaign?.id)
    const currencyName = campaignOpenData?.token.name || ''
    const decimals = campaignOpenData?.token.decimals || 6

    // NOTE: the actual payment is when the campaign is started (openings -> start dates, activeFrom is fallback)
    // The question is: Is that ok from accounting stand point
    // TODO: Should we have invoices for the full amount and credit notes for the refunds (on stop or expire with no full budget used)
    const start = new Date(
      campaignOpenData?.startDate || Number(campaign?.activeFrom) || 0
    ).getTime()

    const end = new Date(campaignCloseData?.closeDate || to).getTime()

    // TODO: discuss the payment and invoice date

    const amount = parseBigNumTokenAmountToDecimal(
      BigInt(campaignOpenData?.amount || campaign?.campaignBudget || 0) -
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
    campaign?.activeFrom,
    campaign?.activeTo,
    campaign?.campaignBudget,
    campaign?.id,
    openings,
    refunds
  ])

  // const campaignMappedAnalytics: BaseAnalyticsData[] | undefined = useMemo(
  //   () => mappedAnalytics.get(analyticsKey?.key || ''),
  //   [analyticsKey, mappedAnalytics]
  // )

  // useEffect(() => {
  //   if (!campaign) return
  //   setAnalyticsKey(undefined)

  //   const checkAnalytics = async () => {
  //     try {
  //       const key = await getAnalyticsKeyAndUpdate('hostname', campaign)
  //       setAnalyticsKey(key)
  //     } catch (e) {
  //       console.error('Can not get Analytics key: ', e)
  //     }
  //   }

  //   checkAnalytics()
  // }, [campaign, getAnalyticsKeyAndUpdate])

  const elements: IInvoiceDetails = useMemo(() => {
    const impressions = campaignData?.impressions || 0
    const clicks = campaignData?.clicks || 0

    return {
      invoiceId: campaign?.id || '',
      invoiceDate: new Date(invoiceData.invoiceDate),
      paymentDate: new Date(invoiceData.paymentDate),
      seller: ADEX_COMPANY_DETAILS,
      buyer: {
        ...billingDetails,
        ethAddress: address
      },
      // TODO: Check if the value of VAT% should be greater than 0
      vatPercentageInUSD: 0,
      currencyName: invoiceData.currencyName,
      impressions,
      amount: Number(invoiceData.amount),
      clicks,
      ctr: campaignData?.ctr || 0,
      avgCpm: campaignData?.avgCpm || 0
    }
  }, [
    campaignData?.impressions,
    campaignData?.clicks,
    campaignData?.ctr,
    campaignData?.avgCpm,
    invoiceData.amount,
    invoiceData.invoiceDate,
    invoiceData.paymentDate,
    invoiceData.currencyName,
    campaign?.id,
    billingDetails,
    address
  ])

  return (
    <BillingDetailsModal title="Invoice" loading={!campaignsData} opened={opened} close={close}>
      <InvoicesPDF
        invoiceDetails={elements}
        placement={campaign?.targetingInput.inputs.placements.in[0] || 'site'}
      />
    </BillingDetailsModal>
  )
}
