import { Radio, Text } from '@mantine/core'
import { Placement } from 'adex-common'
import { CAMPAIGN_PLACEMENTS_INPUT } from 'constants/createCampaign'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'
import { useCallback, useEffect } from 'react'

const SelectPlacements = () => {
  const {
    campaign: {
      targetingInput: {
        inputs: {
          placements: {
            in: [placement]
          }
        }
      }
    },
    updateCampaign,
    updateCampaignWithPrevStateNested
  } = useCreateCampaignContext()

  const updatePlacements = useCallback(
    (value: Placement) => updateCampaignWithPrevStateNested(CAMPAIGN_PLACEMENTS_INPUT, [value]),
    [updateCampaignWithPrevStateNested]
  )

  useEffect(() => {
    if (placement === 'app') updateCampaign('devices', [])
  }, [placement, updateCampaign])

  return (
    <>
      <Text color="secondaryText" size="sm" weight="bold" mb="xs">
        1. Select placements
      </Text>
      <Radio
        label="Websites"
        value="web"
        checked={placement === 'site'}
        onChange={() => updatePlacements('site')}
        mb="xs"
      />
      <Radio
        label="Applications"
        value="app"
        checked={placement === 'app'}
        onChange={() => updatePlacements('app')}
      />
    </>
  )
}

export default SelectPlacements
