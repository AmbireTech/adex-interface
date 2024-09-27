import CustomTable, { DataElement } from 'components/common/CustomTable'
import { useDisclosure } from '@mantine/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Campaign, CampaignStatus } from 'adex-common'
import { useCampaignsData } from 'hooks/useCampaignsData'
import useAccount from 'hooks/useAccount'
import { formatDateShort, parseBigNumTokenAmountToDecimal } from 'helpers'
import VisibilityIcon from 'resources/icons/Visibility'
import useAdmin from 'hooks/useAdmin'
import { Account } from 'types'
import InvisibilityIcon from 'resources/icons/Invisibility'
import { MonthPickerInput } from '@mantine/dates'
import dayjs from 'dayjs'
import { Stack } from '@mantine/core'
import { InvoicesModal } from './InvoicesModal'

const columnTitles = ['Company Name', 'Campaign', 'Date', 'Campaign Period']

const getInvoiceDate = (account?: Account, campaign?: Campaign) => {
  const to = Number(campaign?.activeTo || 0)
  const campaignCloseData = account?.refundsFromCampaigns.perCampaign.find(
    (item) => item.id === campaign?.id
  )

  const end = new Date(campaignCloseData?.closeDate || to).getTime()

  const invoiceDate = Math.min(end, to)

  return invoiceDate
}

const Invoices = ({ forAdmin }: { forAdmin?: boolean }) => {
  const [opened, { open, close }] = useDisclosure(false)
  const { campaignsData, updateAllCampaignsData } = useCampaignsData()
  const campaigns = useMemo(() => Array.from(campaignsData.values()), [campaignsData])
  const { accounts, initialDataLoading, getAllAccounts } = useAdmin()
  const { adexAccount } = useAccount()
  const [months, setMonths] = useState<Date[]>([])

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

    // TODO: discuss the payment and invoice date

    const amount = parseBigNumTokenAmountToDecimal(
      BigInt(campaignOpenData?.amount || selectedCampaign?.campaignBudget || 0) -
        BigInt(campaignCloseData?.amount || 0),
      decimals
    )
    return {
      invoiceDate: getInvoiceDate(account, selectedCampaign),
      paymentDate: start,
      amount,
      currencyName
    }
  }, [account, selectedCampaign])

  const invoiceElements: DataElement[] = useMemo(
    () =>
      campaigns
        .filter((c) => {
          return (
            [
              CampaignStatus.expired,
              CampaignStatus.closedByUser,
              CampaignStatus.exhausted
            ].includes(c.campaign.status) && c.paid > 0
          )
        })
        .sort((a, b) => Number(b.campaign.activeFrom) - Number(a.campaign.activeFrom))
        .map((campaign) => {
          const accountData = forAdmin ? accounts.get(campaign.campaign.owner) : adexAccount
          const invoiceDate = getInvoiceDate(accountData, campaign.campaign)
          const verifiedAccount = accountData?.billingDetails?.verified
          return {
            id: campaign.campaignId + campaign.campaign.activeFrom + campaign.campaign.activeTo,
            rowColor: verifiedAccount ? undefined : 'error',
            columns: [
              {
                value: `${!verifiedAccount ? '* ' : ''}${accountData?.billingDetails?.companyName}`
              },
              { value: campaign.campaign.title },
              {
                value: invoiceDate,
                element: formatDateShort(new Date(invoiceDate))
              },
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
        })
        .filter((c) => {
          if (!months.length) {
            return true
          }
          const monthRanges = months.map((x) => {
            const start = dayjs(x).unix() * 1000
            const end = dayjs(x).add(1, 'month').unix() * 1000

            return { start, end }
          })

          return monthRanges.some(
            (x: { start: number; end: number }) =>
              x.start <= Number(c.columns[2].value) && x.end >= Number(c.columns[2].value)
          )
        }),
    [accounts, adexAccount, campaigns, forAdmin, months]
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

  const handlePreviewAndPrint = useCallback(
    (item: { id: string }) => {
      setSelectedCampaignId(item.id)
      open()
      // TODO: close and title
      window.print()
    },
    [open]
  )

  const actions = useMemo(() => {
    return [
      {
        action: handlePreview,
        label: 'Show campaign details',
        icon: <VisibilityIcon />
      },
      {
        action: handlePreviewAndPrint,
        label: 'Show campaign details',
        icon: <InvisibilityIcon />
      }
    ]
  }, [handlePreview, handlePreviewAndPrint])

  return (
    <Stack>
      <MonthPickerInput
        placeholder="Select mont if you want select"
        type="multiple"
        value={months}
        onChange={setMonths}
      />
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
    </Stack>
  )
}

export default Invoices
