import { InvoicesPDF } from 'components/Billing/BillingPDF'
import { ADEX_COMPANY_DETAILS } from 'constants/adexCompanyDetatils'
import { Account, CampaignData, IInvoiceDetails } from 'types'
import { useMemo } from 'react'
import { formatDateShortForDownload } from 'helpers'

import { BillingDetailsModal } from './BillingDetailsModal'

type PrintModalProps = {
  campaignData?: CampaignData
  opened: boolean
  invoiceData: {
    invoiceDate: number
    paymentDate: number
    amount: number
    currencyName: string
  }
  account: Account
  close: () => void
  closeAfterPrint?: boolean
}

export const InvoicesModal = ({
  campaignData,
  invoiceData,
  account,
  opened,
  close,
  closeAfterPrint
}: PrintModalProps) => {
  const campaign = useMemo(() => campaignData?.campaign, [campaignData])

  const elements: IInvoiceDetails = useMemo(() => {
    const impressions = campaignData?.impressions || 0
    const clicks = campaignData?.clicks || 0

    return {
      invoiceId: campaign?.id || '',
      invoiceDate: new Date(invoiceData.invoiceDate),
      paymentDate: new Date(invoiceData.invoiceDate),
      seller: ADEX_COMPANY_DETAILS,
      buyer: {
        ...account?.billingDetails,
        ethAddress: account?.address
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
    campaign?.id,
    invoiceData.invoiceDate,
    invoiceData.currencyName,
    invoiceData.amount,
    account?.billingDetails,
    account?.address
  ])

  return (
    <BillingDetailsModal
      title="Invoice"
      documentTitle={`adex-invoice-${formatDateShortForDownload(
        new Date(invoiceData.invoiceDate)
      )}-${campaign?.id}`}
      loading={!campaignData}
      opened={opened}
      close={close}
      closeAfterPrint={closeAfterPrint}
    >
      <InvoicesPDF
        invoiceDetails={elements}
        placement={campaign?.targetingInput.inputs.placements.in[0] || 'site'}
      />
    </BillingDetailsModal>
  )
}
