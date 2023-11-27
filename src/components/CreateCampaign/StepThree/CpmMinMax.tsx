import { Flex, NumberInput } from '@mantine/core'
import CustomBadge from 'components/common/CustomBadge'

const CpmMinMax = () => {
  // TODO: add validations useCreateCampaignContext here
  return (
    <Flex wrap="nowrap" justify="space-between" w="50%">
      <NumberInput
        hideControls
        size="md"
        w="45%"
        // error={errorToShow}
        description="Recommended: 0.10"
        inputWrapperOrder={['input', 'description', 'error']}
        rightSection={<CustomBadge color="attention" text="Min" mr="sm" size="md" />}
        rightSectionWidth="auto"
      />
      <NumberInput
        hideControls
        size="md"
        w="45%"
        // error={errorToShow}
        description="Recommended: 0.50"
        inputWrapperOrder={['input', 'description', 'error']}
        rightSection={<CustomBadge color="info" text="Max" mr="sm" size="md" />}
        rightSectionWidth="md"
      />
    </Flex>
  )
}

export default CpmMinMax
