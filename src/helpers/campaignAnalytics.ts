import { Placement, IabTaxonomyV3, Campaign } from 'adex-common'
import { SSPsAnalyticsDataQuery, CampaignUI, RequestStatPlacement } from 'types'
import { removeOptionalEmptyStringProps } from './object'

const unknownSrc = '🤷🏼‍♂'

export const getHumneSrcName = (
  indexString: string,
  placement: Placement,
  getBundleId?: boolean
): string => {
  const split = indexString.split('|')
  if (split.length < 4) {
    return indexString
  }
  const id = split[0].replace('i::', '')
  const name = split[1].replace('n::', '')
  const domain = split[2].replace('d::', '')
  const bundle = split[3].replace('b::', '')

  let humne = bundle || domain || id || name

  if (!getBundleId) {
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
  }

  return humne.replaceAll('__', '.').replaceAll('-_-', ' ')
}

export const campaignDataToSSPAnalyticsQuery = (
  campaign: CampaignUI | Campaign
): SSPsAnalyticsDataQuery => {
  return {
    ...removeOptionalEmptyStringProps({
      category: {
        values:
          campaign.targetingInput.inputs.categories.apply === 'all'
            ? []
            : (campaign.targetingInput.inputs.categories[
                campaign.targetingInput.inputs.categories.apply
              ] as IabTaxonomyV3[]),
        operator:
          campaign.targetingInput.inputs.categories.apply === 'all'
            ? undefined
            : campaign.targetingInput.inputs.categories.apply
      },
      country: {
        values:
          campaign.targetingInput.inputs.location.apply === 'all'
            ? []
            : campaign.targetingInput.inputs.location[
                campaign.targetingInput.inputs.location.apply
              ],
        operator:
          campaign.targetingInput.inputs.location.apply === 'all'
            ? undefined
            : campaign.targetingInput.inputs.location.apply
      },
      placement: {
        values:
          campaign.targetingInput.inputs.placements.in?.[0] === 'app'
            ? [RequestStatPlacement.app]
            : [
                RequestStatPlacement.siteDesktop,
                RequestStatPlacement.siteMobile,
                RequestStatPlacement.siteOther
              ],
        operator: 'in'
      },
      format: campaign.adUnits.map((x) => `${x.banner?.format.w}x${x.banner?.format.h}`)

      // campaign.adUnits.map((x) => `${x.banner?.format.h}x${x.banner?.format.w}`)
    })
  }
}
