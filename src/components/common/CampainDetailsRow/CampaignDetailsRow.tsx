import { Divider, Flex, Text, FlexProps, MantineFontSize } from '@mantine/core'

export type CampaignDetailsRowProps = FlexProps & {
  title: string
  value: any | undefined
  lighterColor?: boolean | undefined
  textSize?: MantineFontSize
  noBorder?: boolean
  column?: boolean
}

const CampaignDetailsRow = ({
  title,
  value,
  lighterColor,
  textSize = 'md',
  noBorder = false,
  column = false,
  ...flexProps
}: CampaignDetailsRowProps) => {
  return (
    <>
      <Flex
        direction={column ? 'column' : 'row'}
        justify={column ? 'center' : 'space-between'}
        align={column ? 'stretch' : 'baseline'}
        c={lighterColor ? 'secondaryText' : 'mainText'}
        gap="xs"
        p="xs"
        {...flexProps}
      >
        <Text fw="bold" size={textSize} c="secondaryText">
          {title}
        </Text>
        {typeof value === 'string' ? (
          <Text ta="end" truncate w={column ? '100%' : 'auto'}>
            {value}
          </Text>
        ) : (
          value
        )}
      </Flex>
      <Divider variant="dashed" hidden={noBorder} m="0" />
    </>
  )
}

export default CampaignDetailsRow
