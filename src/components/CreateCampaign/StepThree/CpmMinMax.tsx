import { Flex, TextInput, Text, MediaQuery } from '@mantine/core'
import { useCreateCampaignFormContext } from 'contexts/CreateCampaignFormContext'

const CpmMinMax = () => {
  const form = useCreateCampaignFormContext()

  return (
    <MediaQuery
      smallerThan="lg"
      styles={{
        maxWidth: '100%'
      }}
    >
      <Flex wrap="nowrap" justify="space-between" maw="50%">
        <TextInput
          size="md"
          w="45%"
          description="Approx. ~ $0.10"
          inputWrapperOrder={['input', 'description', 'error']}
          rightSection={
            <Text color="brand" mr="sm" size="sm">
              Min
            </Text>
          }
          rightSectionWidth="auto"
          {...form.getInputProps('pricingBounds.IMPRESSION.min')}
        />
        <TextInput
          size="md"
          w="45%"
          description="Approx. ~ $0.10"
          inputWrapperOrder={['input', 'description', 'error']}
          rightSection={
            <Text color="brand" mr="sm" size="sm">
              Max
            </Text>
          }
          rightSectionWidth="md"
          {...form.getInputProps('pricingBounds.IMPRESSION.max')}
        />
      </Flex>
    </MediaQuery>
  )
}

export default CpmMinMax
