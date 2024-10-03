import {
  CampaignFundsActive,
  CampaignRefunds,
  Deposit,
  OperationEntry,
  OperationEntryType
} from 'types'

export const toOperationEntry = (
  type: OperationEntryType,
  el: CampaignFundsActive | CampaignRefunds | Deposit
) => {
  let date = new Date()
  let id = ''
  let name: string = type

  switch (type) {
    case 'deposit':
    case 'withdraw':
      date = (el as Deposit).created
      id = (el as Deposit).txHash
      break
    case 'campaignOpen':
      date = (el as CampaignFundsActive).startDate
      id = (el as CampaignFundsActive).id
      name = 'campaign open'
      break
    case 'campaignRefund':
      date = (el as CampaignRefunds).closeDate
      id = (el as CampaignRefunds).id
      name = 'refund from campaign'
      break
    default:
      break
  }

  date = new Date(date)

  const oe: OperationEntry = {
    ...el,
    id: id || date.getTime().toString(),
    name,
    type,
    amount: BigInt(el.amount),
    date
  }

  return oe
}
