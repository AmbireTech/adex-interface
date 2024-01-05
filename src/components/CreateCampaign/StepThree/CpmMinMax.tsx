import { Flex, TextInput } from '@mantine/core'
import CustomBadge from 'components/common/CustomBadge'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'

const CpmMinMax = () => {
  const form = useCreateCampaignFormContext()
  return (
    <Flex wrap="nowrap" justify="space-between" w="50%">
      <TextInput
        size="md"
        w="45%"
        description="Recommended: 0.10"
        inputWrapperOrder={['input', 'description', 'error']}
        rightSection={<CustomBadge color="attention" text="Min" mr="sm" size="md" />}
        rightSectionWidth="auto"
        {...form.getInputProps('cpmMin')}
      />
      <TextInput
        size="md"
        w="45%"
        description="Recommended: 0.50"
        inputWrapperOrder={['input', 'description', 'error']}
        rightSection={<CustomBadge color="info" text="Max" mr="sm" size="md" />}
        rightSectionWidth="md"
        {...form.getInputProps('cpmMax')}
      />
    </Flex>
  )
}

export default CpmMinMax
