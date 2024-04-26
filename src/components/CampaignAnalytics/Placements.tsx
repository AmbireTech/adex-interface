import { Placement } from 'adex-common'
import CustomTable from 'components/common/CustomTable'
import { useMemo } from 'react'
import { BaseAnalyticsData } from 'types'

const unknownSrc = '🤷🏼‍♂'

const getHumneSrcName = (indexString: string, placement: Placement): string => {
  const split = indexString.split('|')
  if (split.length < 4) {
    return indexString
  }
  const id = split[0].replace('i::', '')
  const name = split[1].replace('n::', '')
  const domain = split[2].replace('d::', '')
  const bundle = split[3].replace('b::', '')

  let humne = ''
  switch (placement) {
    case 'app':
      humne = name || bundle || domain || id || indexString || unknownSrc
      break
    case 'site':
      humne = domain || name || id || unknownSrc
      break
    default:
      humne = name || domain || id || bundle || unknownSrc
  }

  return humne.replaceAll('__', '.').replaceAll('-_-', ' ')
}

const Placements = ({
  placements,
  currencyName,
  placement
}: {
  placements: BaseAnalyticsData[] | undefined
  currencyName: string
  placement: Placement
}) => {
  if (!placements?.length) {
    return <div>No placement found</div>
  }

  const headings = useMemo(
    () => [
      placement === 'app' ? 'App' : 'Site',
      'Impressions',
      'Clicks',
      'CTR %',
      'Spent',
      'Average CPM'
    ],
    [placement]
  )

  const elements = useMemo(
    () =>
      placements?.map((item) => ({
        id: item.segment,
        segment: getHumneSrcName(item.segment, placement),
        impressions: item.impressions.toLocaleString(),
        clicks: item.clicks.toLocaleString(),
        ctr: `${item.ctr}`,
        paid: `${item.paid} ${currencyName}`,
        avgCpm: `${item.avgCpm} ${currencyName}`
      })) || [],
    [placements, placement, currencyName]
  )
  return <CustomTable background headings={headings} elements={elements} />
}

export default Placements
