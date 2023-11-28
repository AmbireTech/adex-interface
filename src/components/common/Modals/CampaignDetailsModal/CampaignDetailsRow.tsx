import { Flex, FlexProps, MantineNumberSize, Text, createStyles } from '@mantine/core'

const useStyles = createStyles((theme, { lighterColor }: { lighterColor: boolean }) => ({
  border: {
    borderBottom: `1px dashed ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
  },
  textColor: {
    color: !lighterColor
      ? theme.colors.secondaryText[theme.fn.primaryShade()]
      : theme.colors.secondaryText[theme.fn.primaryShade()] +
        theme.other.shades.hexColorSuffix.lighter
  }
}))

type CampaignDetailsRowProps = FlexProps & {
  title: string
  value: any | undefined
  lighterColor?: boolean | undefined
  textSize?: MantineNumberSize
  noBorder?: boolean
}

const CampaignDetailsRow = ({
  title,
  value,
  lighterColor,
  textSize = 'md',
  noBorder = false
}: CampaignDetailsRowProps) => {
  const { classes, cx } = useStyles({ lighterColor: !!lighterColor })
  return (
    <Flex
      key={title}
      justify="space-between"
      className={cx({ [classes.border]: !noBorder })}
      pt="lg"
      pb="lg"
    >
      <Text className={classes.textColor} weight="bold" size={textSize}>
        {title}
      </Text>
      {/* <Text className={classes.textColor}>{value}</Text> */}
      <Text>{value}</Text>
    </Flex>
  )
}

export default CampaignDetailsRow
