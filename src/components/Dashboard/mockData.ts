import { AnalyticsType, BaseAnalyticsData, CampaignData } from 'types'

const dashboardTableElements: (CampaignData & {
  [key in AnalyticsType]: BaseAnalyticsData[]
})[] = [
  {
    // @ts-ignore
    campaign: {
      type: 0,
      title: 'Campaign Name Long',
      status: 2
    },
    served: '100%',
    budget: '3000.00 DAI',
    impressions: 999999999,
    clicks: 999999,

    ctr: 0.5,
    period: {
      from: '08.02.23',
      to: '08.03.23'
    },
    hostname: [
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      },
      {
        analyticsType: 'hostname',
        segment: 'animefire.net',
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69,
        avgCpm: 0.15
      }
    ],
    adUnit: [
      {
        analyticsType: 'adUnit',
        segment: 'adunit-1',
        // media: Banner,
        impressions: 1204527,
        clicks: 10048,
        ctr: 0.712,
        paid: 69
      }
    ],
    country: [
      {
        analyticsType: 'country',

        segment: 'USA',

        impressions: 123456789,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',

        segment: 'BGR',

        impressions: 12345678,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'DEU',

        impressions: 1234567,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'FRA',

        impressions: 123456,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'AUS',

        impressions: 12345,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'IND',

        impressions: 1234,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'CHN',

        impressions: 123,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'RUS',

        impressions: 12,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'AUT',

        impressions: 1,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'BRA',

        impressions: 12343421,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'ESP',

        impressions: 132,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      },
      {
        analyticsType: 'country',
        segment: 'ALB',

        impressions: 12,
        clicks: 10048,
        ctr: 0.712,
        avgCpm: 0.15,
        paid: 69
      }
    ],
    timeframe: [
      {
        analyticsType: 'timeframe',
        segment: '1713933799000',
        impressions: 9146,
        clicks: 1,
        paid: 3
      },
      {
        analyticsType: 'timeframe',

        segment: '1714020199000',
        impressions: 300,
        clicks: 5,
        paid: 1.01
      },
      {
        analyticsType: 'timeframe',
        segment: '1714106599000',
        impressions: 30568,
        clicks: 55,
        paid: 4.21
      },
      {
        analyticsType: 'timeframe',
        segment: '1714192999000',
        impressions: 21000,
        clicks: 42,
        paid: 3.21
      },
      {
        analyticsType: 'timeframe',
        segment: '1714279399000',
        impressions: 0,
        clicks: 0,
        paid: 0
      },
      {
        analyticsType: 'timeframe',
        segment: '1714365699000',
        impressions: 9146,
        clicks: 15,
        paid: 3
      },
      {
        analyticsType: 'timeframe',
        segment: '1714365799000',
        clicks: 2,
        impressions: 300,
        paid: 1.01
      },
      {
        analyticsType: 'timeframe',
        segment: '1714452199000',
        impressions: 30568,
        clicks: 21,
        paid: 4.21
      },
      {
        analyticsType: 'timeframe',
        segment: '1714462999000',
        impressions: 21000,
        clicks: 17,
        paid: 3.21
      },
      {
        analyticsType: 'timeframe',
        segment: '1714480999000',
        clicks: 5,
        impressions: 16000,
        paid: 2.21
      }
    ]
  }
]

export { dashboardTableElements }
