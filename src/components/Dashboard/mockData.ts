import { ICampaignData } from 'types'
import Banner from 'resources/banners/banner1.png'

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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 2,
        country: 'Bulgaria',
        share: 48.44,
        impressions: 132,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 3,
        country: 'Germany',
        share: 48.44,
        impressions: 12,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 4,
        country: 'France',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 5,
        country: 'Australia',
        share: 48.44,
        impressions: 132,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 6,
        country: 'India',
        share: 48.44,
        impressions: 12,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 7,
        country: 'China',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 8,
        country: 'Russia',
        share: 48.44,
        impressions: 132,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 9,
        country: 'Austria',
        share: 48.44,
        impressions: 12,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 10,
        country: 'Brazil',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 11,
        country: 'Spain',
        share: 48.44,
        impressions: 132,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      },
      {
        id: 12,
        country: 'Albania',
        share: 48.44,
        impressions: 12,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 4,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 5,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 6,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 7,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 8,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 9,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 10,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 11,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  },
  {
    id: 12,
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
    },
    placements: [
      {
        id: 1,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 2,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 3,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 4,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 12,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 5,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 6,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 7,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 8,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 9,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 10,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      },
      {
        id: 11,
        website: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '186.53 DAI',
        averageCPM: '0.15 DAI'
      }
    ],
    creatives: [
      {
        id: 1,
        media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctrPercents: 0.712,
        spent: '18.53 DAI'
      }
    ],
    regions: [
      {
        id: 1,
        country: 'United States',
        share: 48.44,
        impressions: 12343421,
        clicks: 10048,
        ctrPercents: 0.712,
        averageCPM: '0.15 DAI',
        spent: '181.53 DAI'
      }
    ]
  }
]

export { dashboardTableElements }
