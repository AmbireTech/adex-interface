import { Flex, TextInput, Text, MediaQuery } from '@mantine/core'
import { ChangeEvent } from 'react'

type CpmMinMaxtProps = {
  errorMin: string
  errorMax: string
  defaultValueMin: number
  defaultValueMax: number
  onChangeMin: (event: ChangeEvent<HTMLInputElement>) => void
  onChangeMax: (event: ChangeEvent<HTMLInputElement>) => void
}

const CpmMinMax = ({
  errorMin,
  errorMax,
  defaultValueMin,
  defaultValueMax,
  onChangeMin,
  onChangeMax
}: CpmMinMaxtProps) => {
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
          placeholder="CPM min"
          // Temporary disabled until we are ready to get real data
          // description="Approx. ~ $0.10"
          inputWrapperOrder={['input', 'description', 'error']}
          rightSection={
            <Text color="brand" mr="sm" size="sm">
              Min
            </Text>
          }
          rightSectionWidth="auto"
          name="cpmPricingBoundsMin"
          defaultValue={defaultValueMin}
          onChange={(event) => onChangeMin(event)}
          error={errorMin && <Text size="sm">{errorMin}</Text>}
        />
        <TextInput
          size="md"
          w="45%"
          placeholder="CPM max"
          // Temporary disabled until we are ready to get real data
          // description="Approx. ~ $0.50"
          inputWrapperOrder={['input', 'description', 'error']}
          rightSection={
            <Text color="brand" mr="sm" size="sm">
              Max
            </Text>
          }
          rightSectionWidth="md"
          name="cpmPricingBoundsMax"
          defaultValue={defaultValueMax}
          onChange={(event) => onChangeMax(event)}
          error={errorMax && <Text size="sm">{errorMax}</Text>}
        />
      </Flex>
    </MediaQuery>
  )
}

export default CpmMinMax
