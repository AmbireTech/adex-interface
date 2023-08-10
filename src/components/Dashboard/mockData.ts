import { ICampaignData } from 'types'

const dashboardTableElements: ICampaignData[] = [
  {
    id: 1,
    campaignName: 'Campaign Name Long',
    model: 'CPM',
    status: 'draft',
    served: '100%',
    budget: '3000.00 DAI',
    impressions: 999999999,
    clicks: 999999,
    ctr: 0.5,
    period: {
      from: '08.02.23',
      to: '08.03.23'
    }
  },
  {
    id: 2,
    campaignName: 'Campaign Name Long',
    model: 'CPM',
    status: 'underReview',
    served: '100%',
    budget: '3000.00 DAI',
    impressions: 999999999,
    clicks: 999999,
    ctr: 0.5,
    period: {
      from: '08.02.23',
      to: '08.03.23'
    }
  },
  {
    id: 3,
    campaignName: 'Campaign Name Long',
    model: 'CPM',
    status: 'completed',
    served: '100%',
    budget: '3000.00 DAI',
    impressions: 999999999,
    clicks: 999999,
    ctr: 0.5,
    period: {
      from: '08.02.23',
      to: '08.03.23'
    }
  }
]

export { dashboardTableElements }
