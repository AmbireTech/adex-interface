import { Radio, Text } from '@mantine/core'
import useCreateCampaignContext from 'hooks/useCreateCampaignContext'

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
    getInputProps,
    key
  } = useCreateCampaignContext()

  return (
    <Radio.Group
      label={
        <Text c="secondaryText" size="sm" fw="bold" mb="xs">
          1. Select placements
        </Text>
      }
      name="placement"
      defaultValue={placement}
      key={key('targetingInput.inputs.placements.in.0')}
      {...getInputProps('targetingInput.inputs.placements.in.0')}
    >
      <Radio label="Websites" value="site" mb="xs" />
      <Radio label="Applications" value="app" />
    </Radio.Group>
  )
}

export default SelectPlacements
