import { AnalyticsType, BaseAnalyticsData, CampaignData } from 'types'

const dashboardTableElements: (CampaignData & {
  [key in AnalyticsType]: BaseAnalyticsData[]
})[] = [
  {
    campaignId: 'korcampaigm',
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
        segment: '07/04/2024',
        impressions: 9146,
        clicks: 5,
        ctr: 96,
        avgCpm: 0.164,
        paid: 69
      },
      {
        analyticsType: 'timeframe',

        segment: '08/04/2024',
        impressions: 300,
        clicks: 5,

        ctr: 3,
        avgCpm: 0.0063,
        paid: 1.01
      },
      {
        analyticsType: 'timeframe',
        segment: '09/04/2024',
        impressions: 30568,
        clicks: 5,

        ctr: 21,
        avgCpm: 0.153,
        paid: 4.21
      },
      {
        analyticsType: 'timeframe',
        segment: '10/04/2024',
        impressions: 21000,
        ctr: 232,
        clicks: 5,

        avgCpm: 0.111,
        paid: 3.21
      },
      {
        analyticsType: 'timeframe',
        segment: '11/04/2024',
        impressions: 16000,
        ctr: 55,
        clicks: 5,
        avgCpm: 0.089,
        paid: 2.21
      },
      {
        analyticsType: 'timeframe',
        segment: '12/04/2024',
        impressions: 9146,
        clicks: 5,
        ctr: 96,
        avgCpm: 0.164,
        paid: 69
      },
      {
        analyticsType: 'timeframe',
        segment: '13/04/2024',
        clicks: 5,
        impressions: 300,
        ctr: 3,
        avgCpm: 0.0063,
        paid: 1.01
      },
      {
        analyticsType: 'timeframe',
        segment: '14/04/2024',
        impressions: 30568,
        clicks: 5,
        ctr: 21,
        avgCpm: 0.153,
        paid: 4.21
      },
      {
        analyticsType: 'timeframe',
        segment: '15/04/2024',
        impressions: 21000,
        clicks: 5,
        ctr: 232,
        avgCpm: 0.111,
        paid: 3.21
      },
      {
        analyticsType: 'timeframe',
        segment: '16/04/2024',
        clicks: 5,
        impressions: 16000,
        ctr: 55,
        avgCpm: 0.089,
        paid: 2.21
      }
    ]
  }
]

export { dashboardTableElements }
