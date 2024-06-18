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
      refundsFromCampaigns: { perCampaign }
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
    () =>
      campaign?.id && !!perCampaign.length
        ? perCampaign.find((item) => item.id === campaign?.id)?.token.name || ''
        : '',
    [campaign?.id, perCampaign]
  )
  const closeDate = useMemo(
    () =>
      campaign?.id && !!perCampaign.length
        ? perCampaign.find((item) => item.id === campaign?.id)?.closeDate || undefined
        : undefined,
    [campaign?.id, perCampaign]
  )
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
      invoiceDate: (closeDate && new Date(closeDate)) || new Date(),
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
  }, [address, billingDetails, campaign?.id, campaignMappedAnalytics, currencyName, closeDate])

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
